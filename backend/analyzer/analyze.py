import sys
import os
import json

def analyze_js(code):
    issues = []
    lines = code.splitlines()

    for idx, line in enumerate(lines, start=1):
        if "eval(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Use of eval() detected",
                "recommendation": "Avoid using eval() as it can lead to code injection vulnerabilities."
            })
        if "fetch(" in line and '"Authorization"' not in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Unsecured fetch() request detected",
                "recommendation": "Ensure that sensitive API requests include proper Authorization headers."
            })
        if "http://" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Insecure HTTP protocol detected",
                "recommendation": "Use HTTPS to protect data in transit."
            })

    return issues

def analyze_py(code):
    issues = []
    lines = code.splitlines()

    for idx, line in enumerate(lines, start=1):
        if "eval(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Use of eval() detected",
                "recommendation": "Avoid using eval() to prevent code injection."
            })
        if "input(" in line and not line.strip().startswith("#"):
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Raw input without validation",
                "recommendation": "Validate user input before processing."
            })

    return issues

def analyze_c(code):
    issues = []
    lines = code.splitlines()

    for idx, line in enumerate(lines, start=1):
        if "gets(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Use of gets() detected",
                "recommendation": "Replace gets() with fgets() to avoid buffer overflows."
            })
        if "strcpy(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Use of strcpy() without bounds check",
                "recommendation": "Use strncpy() with a size limit to prevent overflows."
            })

    return issues

def analyze_java(code):
    issues = []
    lines = code.splitlines()

    for idx, line in enumerate(lines, start=1):
        if "System.exit(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Abrupt termination using System.exit()",
                "recommendation": "Avoid using System.exit() in production code."
            })
        if "Runtime.getRuntime().exec(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Command execution via exec()",
                "recommendation": "Sanitize input and avoid exec() to prevent command injection."
            })

    return issues

def analyze_html(code):
    issues = []
    lines = code.splitlines()

    for idx, line in enumerate(lines, start=1):
        if "<script>" in line and "alert(" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Inline JavaScript alert()",
                "recommendation": "Avoid inline JS; use external files and sanitize inputs."
            })
        if "http://" in line:
            issues.append({
                "line": idx,
                "code": line.strip(),
                "issue": "Insecure resource link (http)",
                "recommendation": "Use HTTPS for all external resources."
            })

    return issues

def analyze_file(file_path):
    if not os.path.exists(file_path):
        return [{
            "line": "",
            "code": "",
            "issue": "File not found",
            "recommendation": f"No such file: {file_path}"
        }]

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        code = file.read()

    ext = os.path.splitext(file_path)[1].lower()

    # Extension detection fallback based on content
    if not ext:
        if "#include" in code:
            ext = ".c"
        elif "def " in code:
            ext = ".py"
        elif "<html" in code.lower():
            ext = ".html"
        elif "public class" in code:
            ext = ".java"
        elif "function" in code or "let " in code or "const " in code:
            ext = ".js"

    if ext == ".js":
        return analyze_js(code)
    elif ext == ".py":
        return analyze_py(code)
    elif ext == ".c":
        return analyze_c(code)
    elif ext == ".java":
        return analyze_java(code)
    elif ext == ".html":
        return analyze_html(code)
    else:
        return [{
            "line": "",
            "code": "",
            "issue": "Unsupported file type",
            "recommendation": "Currently supports .js, .py, .c, .java, .html"
        }]

if __name__ == "__main__":
    file_path = sys.argv[1]
    result = analyze_file(file_path)
    print(json.dumps(result, indent=2))
