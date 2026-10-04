import os
import glob
import re

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = re.sub(old, new, new_content, flags=re.MULTILINE)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

# Update contents in all TS and HTML files
ts_files = glob.glob('src/app/**/*.ts', recursive=True) + glob.glob('src/app/**/*.html', recursive=True)
for filepath in ts_files:
    # 1. Admin Wrapper -> Admin Hub
    replace_in_file(filepath, [
        (r'admin-wrapper/admin-wrapper', r'admin-hub/admin-hub'),
        (r'AdminWrapper', r'AdminHub'),
        (r'app-admin-wrapper', r'app-admin-hub')
    ])
    
    # 2. Accounting Master Dashboard -> Accounting Hub
    replace_in_file(filepath, [
        (r'accounting\.luxuryapp/general-ledger/master-dashboard/master-dashboard', r'accounting.luxuryapp/general-ledger/accounting-hub/accounting-hub'),
        (r'MasterDashboard', r'AccountingHub'),
        (r'app-master-dashboard', r'app-accounting-hub')
    ])
    
    # 3. Inspection Master Dashboard -> Inspection Hub
    replace_in_file(filepath, [
        (r'inspection-master-dashboard/inspection-master-dashboard', r'inspection-hub/inspection-hub'),
        (r'InspectionMasterDashboard', r'InspectionHub'),
        (r'app-inspection-master-dashboard', r'app-inspection-hub')
    ])
    
    # 4. Salary Projections Master Dashboard -> Salary Projections Hub
    replace_in_file(filepath, [
        (r'human-resources\.luxuryapp/salary-projections/master-dashboard/master-dashboard', r'human-resources.luxuryapp/salary-projections/salary-projections-hub/salary-projections-hub'),
        (r'MasterDashboard', r'SalaryProjectionsHub'),
        (r'app-master-dashboard', r'app-salary-projections-hub')
    ])
