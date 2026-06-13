import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content

    # Remove expandIcon prop
    content = re.sub(r'expandIcon=\{<ExpandMoreIcon[^>]*>\s*\}', '', content)
    content = re.sub(r'expandIcon=\{<ExpandMoreIcon\s*/>\}', '', content)

    # Replace tags
    content = re.sub(r'<Accordion\b[^>]*>', '<div>', content)
    content = content.replace('</Accordion>', '</div>')

    content = re.sub(r'<AccordionSummary\b[^>]*>', '<div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>', content)
    content = content.replace('</AccordionSummary>', '</div>')

    content = re.sub(r'<AccordionDetails\b[^>]*>', '<div style={{ padding: "0 1rem 1rem 1rem" }}>', content)
    content = content.replace('</AccordionDetails>', '</div>')

    if content != orig:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")
