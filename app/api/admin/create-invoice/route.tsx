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
const IBAN = "IE23 BOFI 9028 9017 4899 73";

const ROYAL_BLUE = "#0B2A6F";
const YELLOW = "#FACC15";
const GREY = "#6B7280";

type LineItem = { description: string; qty: number; unit: number };

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, color: "#111827" },
  header: { backgroundColor: ROYAL_BLUE, padding: 14, borderRadius: 10 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  crest: { width: 52, height: 52, marginRight: 12 },
  clubName: { fontSize: 18, fontWeight: 700, color: "white" },
  clubMeta: { fontSize: 10, color: "white", marginTop: 2 },
  yellowBar: { height: 6, backgroundColor: YELLOW, borderRadius: 999, marginTop: 10 },

  topRow: { marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  title: { fontSize: 20, fontWeight: 800, color: ROYAL_BLUE },

  pillDue: { backgroundColor: "#FEF3C7", color: "#92400E", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, fontSize: 10 },
  pillPaid: { backgroundColor: "#DCFCE7", color: "#166534", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, fontSize: 10 },

  section: { marginTop: 12, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12 },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: ROYAL_BLUE, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  strong: { fontWeight: 700 },

  table: { marginTop: 10, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, overflow: "hidden" },
  trHead: { flexDirection: "row", backgroundColor: "#F9FAFB", padding: 8, borderBottomWidth: 1, borderColor: "#E5E7EB" },
  tr: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderColor: "#F3F4F6" },
  th: { fontSize: 10, fontWeight: 700, color: ROYAL_BLUE },
  td: { fontSize: 10 },
  cDesc: { width: "55%" },
  cQty: { width: "15%", textAlign: "right" },
  cUnit: { width: "15%", textAlign: "right" },
  cTotal: { width: "15%", textAlign: "right" },

  totalsBox: { marginTop: 12, alignSelf: "flex-end", width: "50%", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, backgroundColor: "#F9FAFB" },
  totalLine: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  totalBig: { fontSize: 12, fontWeight: 800, color: ROYAL_BLUE },

  footer: { marginTop: 14, fontSize: 9, color: GREY },
});

function eur(n: number) {
  return `€${n.toFixed(2)}`;
}

function InvoicePDF(props: {
  crestUrl: string;
  invoiceNumber: string;
  status: "due" | "paid";
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  items: LineItem[];
  tax: number;
  notes?: string;
}) {
  const subtotal = props.items.reduce((s, it) => s + it.qty * it.unit, 0);
  const total = subtotal + props.tax;

  return (
    <Document>
      <Page style={styles.page}>
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

        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ fontSize: 10, color: GREY, marginTop: 4 }}>
              Invoice No: {props.invoiceNumber}
            </Text>
          </View>
          <Text style={props.status === "paid" ? styles.pillPaid : styles.pillDue}>
            {props.status === "paid" ? "PAID" : "DUE"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Invoice Details</Text>
          <View style={styles.row}><Text>Issue Date</Text><Text style={styles.strong}>{props.issueDate}</Text></View>
          <View style={styles.row}><Text>Due Date</Text><Text style={styles.strong}>{props.dueDate}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill To</Text>
          <Text style={styles.strong}>{props.customerName}</Text>
          <Text>{props.customerEmail}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, styles.cDesc]}>Description</Text>
            <Text style={[styles.th, styles.cQty]}>Qty</Text>
            <Text style={[styles.th, styles.cUnit]}>Unit</Text>
            <Text style={[styles.th, styles.cTotal]}>Total</Text>
          </View>

          {props.items.map((it, idx) => {
            const lineTotal = it.qty * it.unit;
            return (
              <View key={idx} style={styles.tr}>
                <Text style={[styles.td, styles.cDesc]}>{it.description}</Text>
                <Text style={[styles.td, styles.cQty]}>{it.qty}</Text>
                <Text style={[styles.td, styles.cUnit]}>{eur(it.unit)}</Text>
                <Text style={[styles.td, styles.cTotal]}>{eur(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalLine}><Text>Subtotal</Text><Text style={styles.strong}>{eur(subtotal)}</Text></View>
          <View style={styles.totalLine}><Text>Tax</Text><Text style={styles.strong}>{eur(props.tax)}</Text></View>
          <View style={[styles.totalLine, { marginTop: 10 }]}>
            <Text style={styles.totalBig}>Total</Text>
            <Text style={styles.totalBig}>{eur(total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Payment</Text>
          <View style={styles.row}><Text>IBAN</Text><Text style={styles.strong}>{IBAN}</Text></View>
          <Text style={{ marginTop: 6, fontSize: 9, color: GREY }}>
            Please include the invoice number as the payment reference.
          </Text>
        </View>

        {props.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={{ fontSize: 10 }}>{props.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>Generated electronically by {CLUB_NAME}.</Text>
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
    const status: "due" | "paid" = body.status === "paid" ? "paid" : "due";
    const tax = Number(body.tax || 0);
    const notes = body.notes ? String(body.notes) : "";

    const issueDate = body.issueDate ? String(body.issueDate) : new Date().toLocaleDateString("en-IE");
    const dueDate = body.dueDate ? String(body.dueDate) : issueDate;

    const items: LineItem[] = Array.isArray(body.items)
      ? body.items.map((it: any) => ({
          description: String(it.description || "").trim(),
          qty: Number(it.qty || 1),
          unit: Number(it.unit || 0),
        }))
      : [];

    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing customer name or email" }, { status: 400 });
    }
    if (items.length < 1 || items.some((x) => !x.description || x.qty <= 0 || x.unit < 0)) {
      return NextResponse.json({ error: "Add at least 1 valid line item" }, { status: 400 });
    }

    const { data: invoiceNumber, error: numErr } = await supabaseAdmin.rpc("next_doc_number", {
      doc_type: "invoice",
    });
    if (numErr) throw new Error(numErr.message);

    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host");
    const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";
    const crestUrl = `${baseUrl}/crest.png`;

    const pdfBuffer = await renderToBuffer(
      <InvoicePDF
        crestUrl={crestUrl}
        invoiceNumber={invoiceNumber as string}
        status={status}
        issueDate={issueDate}
        dueDate={dueDate}
        customerName={customerName}
        customerEmail={customerEmail}
        items={items}
        tax={tax}
        notes={notes}
      />
    );

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Bweeng Celtic FC <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Invoice ${invoiceNumber} - ${CLUB_NAME}`,
      html: `<p>Please find your invoice attached.</p><p><b>Invoice number:</b> ${invoiceNumber}</p>`,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true, invoiceNumber, result });
  } catch (err: any) {
    console.error("create-invoice error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}