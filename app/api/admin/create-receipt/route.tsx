export const runtime = "nodejs";

import { NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "../_helpers/requireAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

// Club branding
const CLUB_NAME = "Bweeng Celtic FC";
const CLUB_ADDRESS = "Bweeng, Co. Cork, P51KD5C";
const COMPANY_REG = "3341214DH";

const ROYAL_BLUE = "#0B2A6F";
const YELLOW = "#FACC15";
const GREY = "#6B7280";

type LineItem = { description: string; amount: number };

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, color: "#111827" },

  header: { backgroundColor: ROYAL_BLUE, padding: 14, borderRadius: 10 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  crest: { width: 52, height: 52, marginRight: 12 },
  clubName: { fontSize: 18, fontWeight: 700, color: "white" },
  clubMeta: { fontSize: 10, color: "white", marginTop: 2 },
  yellowBar: { height: 6, backgroundColor: YELLOW, borderRadius: 999, marginTop: 10 },

  topRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: { fontSize: 20, fontWeight: 800, color: ROYAL_BLUE },

  pillPaid: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 10,
  },

  section: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: ROYAL_BLUE,
    marginBottom: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  strong: { fontWeight: 700 },

  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  trHead: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  tr: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  th: { fontSize: 10, fontWeight: 700, color: ROYAL_BLUE },
  td: { fontSize: 10 },
  cDesc: { width: "70%" },
  cTotal: { width: "30%", textAlign: "right" },

  totalsBox: {
    marginTop: 12,
    alignSelf: "flex-end",
    width: "50%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  totalLine: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  totalBig: { fontSize: 12, fontWeight: 800, color: ROYAL_BLUE },

  footer: { marginTop: 14, fontSize: 9, color: GREY },
});

function eur(n: number) {
  return `€${n.toFixed(2)}`;
}

function ReceiptPDF(props: {
  crestUrl: string;
  receiptNumber: string;
  paidDate: string;
  customerName: string;
  customerEmail: string;
  reference?: string;
  items: LineItem[];
}) {
  const total = props.items.reduce((s, it) => s + it.amount, 0);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image style={styles.crest} src={props.crestUrl} />
            <View>
              <Text style={styles.clubName}>{CLUB_NAME}</Text>
              <Text style={styles.clubMeta}>{CLUB_ADDRESS}</Text>
              <Text style={styles.clubMeta}>Company Reg: {COMPANY_REG}</Text>
            </View>
          </View>
          <View style={styles.yellowBar} />
        </View>

        {/* Title + Paid */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>RECEIPT</Text>
            <Text style={{ fontSize: 10, color: GREY, marginTop: 4 }}>
              Receipt No: {props.receiptNumber}
            </Text>
          </View>
          <Text style={styles.pillPaid}>PAID</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Receipt Details</Text>
          <View style={styles.row}>
            <Text>Paid Date</Text>
            <Text style={styles.strong}>{props.paidDate}</Text>
          </View>
          {props.reference ? (
            <View style={styles.row}>
              <Text>Reference</Text>
              <Text style={styles.strong}>{props.reference}</Text>
            </View>
          ) : null}
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Customer</Text>
          <Text style={styles.strong}>{props.customerName}</Text>
          <Text>{props.customerEmail}</Text>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, styles.cDesc]}>Description</Text>
            <Text style={[styles.th, styles.cTotal]}>Amount</Text>
          </View>

          {props.items.map((it, idx) => (
            <View key={idx} style={styles.tr}>
              <Text style={[styles.td, styles.cDesc]}>{it.description}</Text>
              <Text style={[styles.td, styles.cTotal]}>{eur(it.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalsBox}>
          <View style={[styles.totalLine, { marginTop: 0 }]}>
            <Text style={styles.totalBig}>Total Paid</Text>
            <Text style={styles.totalBig}>{eur(total)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for supporting {CLUB_NAME}. This receipt was generated electronically.
        </Text>
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    // ✅ Admin protection (must be inside POST)
    const adminCheck = await requireAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const body = await req.json();

    const customerName = String(body.name || "").trim();
    const customerEmail = String(body.email || "").trim();
    const reference = body.reference ? String(body.reference) : "";
    const paidDate = body.date ? String(body.date) : new Date().toLocaleDateString("en-IE");

    const items: LineItem[] = Array.isArray(body.items)
      ? body.items.map((it: any) => ({
          description: String(it.description || "").trim(),
          amount: Number(it.amount || 0),
        }))
      : [];

    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing customer name or email" }, { status: 400 });
    }
    if (
      items.length < 1 ||
      items.some((x) => !x.description || !Number.isFinite(x.amount) || x.amount <= 0)
    ) {
      return NextResponse.json(
        { error: "Add at least 1 valid receipt line item" },
        { status: 400 }
      );
    }

    const { data: receiptNumber, error: numErr } = await supabaseAdmin.rpc("next_doc_number", {
      doc_type: "receipt",
    });
    if (numErr) throw new Error(numErr.message);

    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host");
    const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";
    const crestUrl = `${baseUrl}/crest.png`;

    const pdfBuffer = await renderToBuffer(
      <ReceiptPDF
        crestUrl={crestUrl}
        receiptNumber={receiptNumber as string}
        paidDate={paidDate}
        customerName={customerName}
        customerEmail={customerEmail}
        reference={reference}
        items={items}
      />
    );

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Bweeng Celtic FC <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Receipt ${receiptNumber} - ${CLUB_NAME}`,
      html: `<p>Please find your receipt attached.</p><p><b>Receipt number:</b> ${receiptNumber}</p>`,
      attachments: [
        {
          filename: `${receiptNumber}.pdf`,
          content: pdfBuffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true, receiptNumber, result });
  } catch (err: any) {
    console.error("create-receipt error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}