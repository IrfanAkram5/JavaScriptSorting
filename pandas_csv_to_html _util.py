""" Written by  : Irfan Akram
    Date        : 25/12/2021
    License     : GNU GPLv3
    Github Location: https://github.com/IrfanAkram5/JavaScriptSorting

    Python Utility script to upload a CSV file and download a html table using pandas.  Paths are for windows OS.  Use os.path to build path names 
    if you want to work across platforms.  
    
    ***Note*** pandas will have a go at making sense of the data as well if dtype="str" is not passed. 
    """


import pandas as pd

# Double backslash is for windows systems.
file_to_upload = "C:\\Your\\DirectoryPath\\FileToUpload.csv"
html_file_10k = "C:\\Your\\DirectoryPath\\HtmlTable10k.html"
html_file_100 = "C:\\Your\\DirectoryPath\\HtmlTable100.html"
html_file_1k = "C:\\Your\\DirectoryPath\\HtmlTable1k.html"

if __name__ == "__main__":
    df_all = pd.read_csv(file_to_upload, dtype="str")
    print(df_all.head(5))

    #Split the csv file into 100 and 1000 rows. 
    df_100 = df_all[:100]
    df_1000 = df_all[:1000]

    #Download the file to local directory.
    df_100.to_html(buf=html_file_100, index=False, classes=None, table_id=None)
    df_1000.to_html(buf=html_file_1k, index=False, classes=None, table_id=None)
    df_all.to_html(buf=html_file_10k, index=False, classes=None, table_id=None)
