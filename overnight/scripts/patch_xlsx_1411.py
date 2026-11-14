"""Apply the 14.11.2026 tabs to an existing workbook: python3 patch_xlsx_1411.py IN.xlsx OUT.xlsx"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from openpyxl import load_workbook
import sheet_1411
wb = load_workbook(sys.argv[1])
sheet_1411.apply_all(wb)
wb.save(sys.argv[2])
print("saved", sys.argv[2], wb.sheetnames)
