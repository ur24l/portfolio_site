"""Build single-page A4 DOCX and PDF resumes from src/data/profile.json.

Both outputs use a clean, single-column ATS-safe structure with clear typographic
hierarchy, bottom-ruled section headers, right-aligned dates, and clickable links.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
PROFILE = json.loads((ROOT / "src/data/profile.json").read_text(encoding="utf-8"))

OUT_DOCX = ROOT / "public/assets/Bhargav-Sai-Bhartu-Resume.docx"
OUT_PDF = ROOT / "public/assets/Bhargav-Sai-Bhartu-Resume.pdf"

# Palette
NAVY_HEX = "0F172A"
BODY_HEX = "1E293B"
MUTED_HEX = "475569"
ACCENT_HEX = "1D4ED8"
RULE_HEX = "CBD5E1"


def short_dates(text: str) -> str:
    return (
        text.replace("January", "Jan")
        .replace("February", "Feb")
        .replace("March", "Mar")
        .replace("April", "Apr")
        .replace("June", "Jun")
        .replace("July", "Jul")
        .replace("August", "Aug")
        .replace("September", "Sep")
        .replace("October", "Oct")
        .replace("November", "Nov")
        .replace("December", "Dec")
    )


def short_degree(text: str) -> str:
    return (
        text.replace("Bachelor of Technology (B.Tech),", "B.Tech in")
        .replace("Diploma,", "Diploma in")
    )


def build_docx() -> None:
    doc = Document()
    section = doc.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.45)
    section.bottom_margin = Inches(0.42)
    section.left_margin = Inches(0.55)
    section.right_margin = Inches(0.55)
    text_width = section.page_width - section.left_margin - section.right_margin

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(9.5)
    normal.font.color.rgb = RGBColor.from_string(BODY_HEX)
    normal.paragraph_format.line_spacing = 1.12
    normal.paragraph_format.space_after = Pt(2)

    def add_bottom_border(p, hex_color: str = RULE_HEX, sz: str = "6") -> None:
        p_pr = p._p.get_or_add_pPr()
        p_bdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), sz)
        bottom.set(qn("w:space"), "3")
        bottom.set(qn("w:color"), hex_color)
        p_bdr.append(bottom)
        p_pr.append(p_bdr)

    def add_paragraph(
        text: str = "",
        *,
        size: float = 9.5,
        bold: bool = False,
        color: str = BODY_HEX,
        before: float = 0,
        after: float = 2,
        line_spacing: float = 1.12,
    ):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(before)
        p.paragraph_format.space_after = Pt(after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            run.font.name = "Calibri"
            run.font.size = Pt(size)
            run.bold = bold
            run.font.color.rgb = RGBColor.from_string(color)
        return p

    def add_hyperlink(p, text: str, url: str, *, size: float = 9.0, color: str = ACCENT_HEX) -> None:
        r_id = p.part.relate_to(url, RT.HYPERLINK, is_external=True)
        h = OxmlElement("w:hyperlink")
        h.set(qn("r:id"), r_id)
        r = OxmlElement("w:r")
        pr = OxmlElement("w:rPr")
        font = OxmlElement("w:rFonts")
        font.set(qn("w:ascii"), "Calibri")
        font.set(qn("w:hAnsi"), "Calibri")
        pr.append(font)
        sz = OxmlElement("w:sz")
        sz.set(qn("w:val"), str(int(size * 2)))
        pr.append(sz)
        col = OxmlElement("w:color")
        col.set(qn("w:val"), color)
        pr.append(col)
        r.append(pr)
        t = OxmlElement("w:t")
        t.text = text
        r.append(t)
        h.append(r)
        p._p.append(h)

    def add_section_heading(title: str) -> None:
        p = add_paragraph(
            title.upper(),
            size=9.5,
            bold=True,
            color=NAVY_HEX,
            before=8,
            after=4,
            line_spacing=1.05,
        )
        p.paragraph_format.keep_with_next = True
        add_bottom_border(p)

    def add_role_row(left_title: str, right_dates: str, *, after: float = 1) -> None:
        p = add_paragraph(after=after, line_spacing=1.1)
        p.paragraph_format.keep_with_next = True
        p.paragraph_format.tab_stops.add_tab_stop(text_width, WD_TAB_ALIGNMENT.RIGHT)
        r_left = p.add_run(left_title)
        r_left.font.name = "Calibri"
        r_left.font.size = Pt(10)
        r_left.bold = True
        r_left.font.color.rgb = RGBColor.from_string(NAVY_HEX)
        r_right = p.add_run("\t" + right_dates)
        r_right.font.name = "Calibri"
        r_right.font.size = Pt(9)
        r_right.font.color.rgb = RGBColor.from_string(MUTED_HEX)

    def add_bullet(text: str) -> None:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Inches(0.18)
        p.paragraph_format.first_line_indent = Inches(-0.13)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1.8)
        p.paragraph_format.line_spacing = 1.12
        p.paragraph_format.keep_together = True
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(9.3)
        r.font.color.rgb = RGBColor.from_string(BODY_HEX)

    # Header
    add_paragraph(PROFILE["name"], size=21, bold=True, color=NAVY_HEX, after=1.5, line_spacing=1.05)
    add_paragraph(PROFILE["headline"], size=11, bold=True, color=ACCENT_HEX, after=4, line_spacing=1.05)

    contact = add_paragraph(after=1.5, line_spacing=1.1)
    r_loc = contact.add_run(f"{PROFILE['location']}  |  {PROFILE['phone']}  |  ")
    r_loc.font.name = "Calibri"
    r_loc.font.size = Pt(9)
    r_loc.font.color.rgb = RGBColor.from_string(MUTED_HEX)
    add_hyperlink(contact, PROFILE["email"], f"mailto:{PROFILE['email']}", size=9)
    r_sep = contact.add_run("  |  ")
    r_sep.font.name = "Calibri"
    r_sep.font.size = Pt(9)
    r_sep.font.color.rgb = RGBColor.from_string(MUTED_HEX)
    add_hyperlink(contact, "linkedin.com/in/bhargav-sai-bhartu", PROFILE["linkedin"], size=9)
    r_sep2 = contact.add_run("  |  ")
    r_sep2.font.name = "Calibri"
    r_sep2.font.size = Pt(9)
    r_sep2.font.color.rgb = RGBColor.from_string(MUTED_HEX)
    add_hyperlink(contact, "github.com/ur24l", PROFILE["github"], size=9)

    # Professional Summary
    add_section_heading("Professional Summary")
    add_paragraph(PROFILE["summary"], size=9.3, color=BODY_HEX, after=2, line_spacing=1.14)

    # Experience
    add_section_heading("Experience")
    for idx, job in enumerate(PROFILE["experience"]):
        add_role_row(job["title"], short_dates(job["dates"]))
        org_p = add_paragraph(
            job["org"], size=9.2, bold=False, color=MUTED_HEX, before=0, after=2.5
        )
        org_p.paragraph_format.keep_with_next = True
        for line in job["bullets"]:
            add_bullet(line)
        if idx < len(PROFILE["experience"]) - 1:
            add_paragraph(after=2, line_spacing=1.0)

    # Skills
    add_section_heading("Technical Skills")
    for label, items in PROFILE["skills"]:
        p = add_paragraph(after=1.8, line_spacing=1.12)
        r_lbl = p.add_run(f"{label}: ")
        r_lbl.font.name = "Calibri"
        r_lbl.font.size = Pt(9.3)
        r_lbl.bold = True
        r_lbl.font.color.rgb = RGBColor.from_string(NAVY_HEX)
        r_val = p.add_run(items)
        r_val.font.name = "Calibri"
        r_val.font.size = Pt(9.3)
        r_val.font.color.rgb = RGBColor.from_string(BODY_HEX)

    # Selected Projects
    add_section_heading("Selected Projects")
    for project in PROFILE["projects"]:
        p = add_paragraph(after=1.5, line_spacing=1.1)
        p.paragraph_format.keep_with_next = True
        r_name = p.add_run(project["name"])
        r_name.font.name = "Calibri"
        r_name.font.size = Pt(9.7)
        r_name.bold = True
        r_name.font.color.rgb = RGBColor.from_string(NAVY_HEX)
        r_tech = p.add_run(f"  |  {project['tech']}")
        r_tech.font.name = "Calibri"
        r_tech.font.size = Pt(8.8)
        r_tech.font.color.rgb = RGBColor.from_string(MUTED_HEX)
        for line in project["bullets"]:
            add_bullet(line)

    # Education
    add_section_heading("Education")
    for edu in PROFILE["education"]:
        add_role_row(short_degree(edu["degree"]), short_dates(edu["dates"]))
        add_paragraph(
            f"{edu['school']}  |  {edu['detail']}",
            size=9.1,
            color=MUTED_HEX,
            after=3,
        )

    # Achievements & Certifications
    add_section_heading("Achievements & Certifications")
    for line in PROFILE["achievements"]:
        add_bullet(line)
    add_paragraph(
        "Languages: Telugu (Native), English (Fluent)",
        size=9.0,
        color=MUTED_HEX,
        before=2,
        after=0,
    )

    doc.core_properties.title = f"{PROFILE['name']} - Resume"
    doc.core_properties.author = PROFILE["name"]
    doc.core_properties.subject = PROFILE["headline"]
    doc.save(OUT_DOCX)


def register_pdf_fonts() -> tuple[str, str]:
    """Register clean system TrueType fonts when present, falling back to Helvetica."""
    candidates = [
        ("Calibri", r"C:\Windows\Fonts\calibri.ttf", r"C:\Windows\Fonts\calibrib.ttf"),
        ("SegoeUI", r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\segoeuib.ttf"),
        ("Arial", r"C:\Windows\Fonts\arial.ttf", r"C:\Windows\Fonts\arialbd.ttf"),
    ]
    for family, regular, bold in candidates:
        if os.path.exists(regular) and os.path.exists(bold):
            pdfmetrics.registerFont(TTFont(family, regular))
            pdfmetrics.registerFont(TTFont(f"{family}-Bold", bold))
            return family, f"{family}-Bold"
    return "Helvetica", "Helvetica-Bold"


def build_pdf() -> None:
    font_reg, font_bold = register_pdf_fonts()

    navy = colors.HexColor(f"#{NAVY_HEX}")
    body = colors.HexColor(f"#{BODY_HEX}")
    muted = colors.HexColor(f"#{MUTED_HEX}")
    accent = colors.HexColor(f"#{ACCENT_HEX}")
    rule = colors.HexColor(f"#{RULE_HEX}")

    margin_x = 14.5 * mm
    margin_y = 11.5 * mm
    page_w, _ = A4
    content_w = page_w - 2 * margin_x

    doc = SimpleDocTemplate(
        str(OUT_PDF),
        pagesize=A4,
        leftMargin=margin_x,
        rightMargin=margin_x,
        topMargin=margin_y,
        bottomMargin=margin_y,
        title=f"{PROFILE['name']} - Resume",
        author=PROFILE["name"],
        subject=PROFILE["headline"],
    )

    styles = {
        "name": ParagraphStyle(
            "name",
            fontName=font_bold,
            fontSize=20,
            leading=23,
            textColor=navy,
            spaceAfter=1.5,
        ),
        "headline": ParagraphStyle(
            "headline",
            fontName=font_bold,
            fontSize=10.5,
            leading=13,
            textColor=accent,
            spaceAfter=4,
        ),
        "contact": ParagraphStyle(
            "contact",
            fontName=font_reg,
            fontSize=8.8,
            leading=12,
            textColor=muted,
            spaceAfter=3,
        ),
        "section": ParagraphStyle(
            "section",
            fontName=font_bold,
            fontSize=9.3,
            leading=12,
            textColor=navy,
            spaceBefore=7,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body",
            fontName=font_reg,
            fontSize=9.1,
            leading=12.4,
            textColor=body,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "role",
            fontName=font_bold,
            fontSize=9.7,
            leading=12.5,
            textColor=navy,
        ),
        "date": ParagraphStyle(
            "date",
            fontName=font_reg,
            fontSize=8.8,
            leading=12.5,
            textColor=muted,
            alignment=TA_RIGHT,
        ),
        "org": ParagraphStyle(
            "org",
            fontName=font_reg,
            fontSize=8.9,
            leading=11.5,
            textColor=muted,
            spaceAfter=2,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName=font_reg,
            fontSize=9.0,
            leading=12.0,
            textColor=body,
            leftIndent=10,
            firstLineIndent=-7,
            spaceAfter=1.5,
        ),
        "skill": ParagraphStyle(
            "skill",
            fontName=font_reg,
            fontSize=9.0,
            leading=12.0,
            textColor=body,
            spaceAfter=1.5,
        ),
        "proj_head": ParagraphStyle(
            "proj_head",
            fontName=font_reg,
            fontSize=9.4,
            leading=12.0,
            textColor=navy,
            spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontName=font_reg,
            fontSize=8.8,
            leading=11.5,
            textColor=muted,
            spaceAfter=2.5,
        ),
    }

    story = []

    def add_section(title: str) -> None:
        story.append(Paragraph(escape(title.upper()), styles["section"]))
        story.append(
            HRFlowable(
                width="100%",
                thickness=0.6,
                color=rule,
                spaceBefore=0,
                spaceAfter=4,
            )
        )

    def add_two_col(left_text: str, right_text: str) -> None:
        tbl = Table(
            [
                [
                    Paragraph(escape(left_text), styles["role"]),
                    Paragraph(escape(right_text), styles["date"]),
                ]
            ],
            colWidths=[content_w * 0.74, content_w * 0.26],
        )
        tbl.setStyle(
            TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                    ("VALIGN", (0, 0), (-1, -1), "BASELINE"),
                ]
            )
        )
        story.append(tbl)

    # Header
    story.append(Paragraph(escape(PROFILE["name"]), styles["name"]))
    story.append(Paragraph(escape(PROFILE["headline"]), styles["headline"]))
    contact_html = (
        f"{escape(PROFILE['location'])} &nbsp;|&nbsp; "
        f"{escape(PROFILE['phone'])} &nbsp;|&nbsp; "
        f"<a href='mailto:{escape(PROFILE['email'])}' color='#{ACCENT_HEX}'>{escape(PROFILE['email'])}</a>"
        f" &nbsp;|&nbsp; "
        f"<a href='{escape(PROFILE['linkedin'])}' color='#{ACCENT_HEX}'>linkedin.com/in/bhargav-sai-bhartu</a>"
        f" &nbsp;|&nbsp; "
        f"<a href='{escape(PROFILE['github'])}' color='#{ACCENT_HEX}'>github.com/ur24l</a>"
    )
    story.append(Paragraph(contact_html, styles["contact"]))

    # Summary
    add_section("Professional Summary")
    story.append(Paragraph(escape(PROFILE["summary"]), styles["body"]))

    # Experience
    add_section("Experience")
    for idx, job in enumerate(PROFILE["experience"]):
        add_two_col(job["title"], short_dates(job["dates"]))
        story.append(Paragraph(escape(job["org"]), styles["org"]))
        for line in job["bullets"]:
            story.append(Paragraph(f"•&nbsp; {escape(line)}", styles["bullet"]))
        if idx < len(PROFILE["experience"]) - 1:
            story.append(Spacer(1, 3))

    # Technical Skills
    add_section("Technical Skills")
    for label, items in PROFILE["skills"]:
        story.append(
            Paragraph(
                f"<font name='{font_bold}' color='#{NAVY_HEX}'>{escape(label)}:</font> {escape(items)}",
                styles["skill"],
            )
        )

    # Selected Projects
    add_section("Selected Projects")
    for project in PROFILE["projects"]:
        story.append(
            Paragraph(
                f"<font name='{font_bold}' color='#{NAVY_HEX}'>{escape(project['name'])}</font> "
                f"<font color='#{MUTED_HEX}' size='8.6'>&nbsp;|&nbsp; {escape(project['tech'])}</font>",
                styles["proj_head"],
            )
        )
        for line in project["bullets"]:
            story.append(Paragraph(f"•&nbsp; {escape(line)}", styles["bullet"]))

    # Education
    add_section("Education")
    for edu in PROFILE["education"]:
        add_two_col(short_degree(edu["degree"]), short_dates(edu["dates"]))
        story.append(
            Paragraph(
                f"{escape(edu['school'])} &nbsp;|&nbsp; {escape(edu['detail'])}",
                styles["meta"],
            )
        )

    # Achievements & Certifications
    add_section("Achievements & Certifications")
    for line in PROFILE["achievements"]:
        story.append(Paragraph(f"•&nbsp; {escape(line)}", styles["bullet"]))
    story.append(
        Paragraph(
            "Languages: Telugu (Native), English (Fluent)",
            styles["meta"],
        )
    )

    doc.build(story)


def verify_single_page_pdf() -> None:
    try:
        import pymupdf

        with pymupdf.open(OUT_PDF) as pdf_doc:
            pages = len(pdf_doc)
        if pages != 1:
            raise RuntimeError(f"Expected 1-page PDF resume, got {pages} pages.")
        print(f"Verified {OUT_PDF.name}: {pages} page (A4)")
    except ImportError:
        print("pymupdf not installed; skipping PDF page-count check.")


if __name__ == "__main__":
    import sys

    build_docx()
    print(f"Generated: {OUT_DOCX}")
    # The PDF is printed from the /resume/ page so it matches the website (scripts/export_resume_pdf.ps1).
    # The older ReportLab layout is still available on request:
    if "--reportlab-pdf" in sys.argv:
        build_pdf()
        verify_single_page_pdf()
        print(f"Generated: {OUT_PDF}")
