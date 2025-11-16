from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT

def set_normal_style(doc):
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Trebuchet MS'
    font.size = Pt(12)
    # set 1.5 line spacing
    style.paragraph_format.line_spacing = 1.5
    style.paragraph_format.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY

if __name__ == '__main__':
    docx_path = 'REPORT.docx'
    out_path = 'REPORT_formatted.docx'
    doc = Document(docx_path)
    set_normal_style(doc)
    # Also set alignment for all paragraphs to justified
    for p in doc.paragraphs:
        p.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
    doc.save(out_path)
    print(f'Saved formatted docx to {out_path}')
