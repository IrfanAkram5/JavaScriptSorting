""" Written by  : Irfan Akram
    Date        : 25/12/2021
    License     : GNU GPLv3
    Github Location: https://github.com/IrfanAkram5/JavaScriptSorting

    Python Utility script to upload a CSV file and download a html table using pandas.  Paths are for windows OS.  Use os.path to build path names
    if you want to work across platforms.

    ***Note*** pandas will have a go at making sense of the data as well if dtype="str" is not passed.
    """

from typing import Dict, Iterable, List, Any
import pandas as pd
import re

# this module is for my local file paths.  It is not needed.
from python_modules_for_util_pgm import local_file_paths as lfp

# Instead, uncomment these and put in your own file paths.
# Double backslash is for windows systems.
# file_to_upload = "C:\\Your\\DirectoryPath\\FileToUpload.csv"
# html_file_10k = "C:\\Your\\DirectoryPath\\HtmlTable10k2col.html"
# html_file_10k = "C:\\Your\\DirectoryPath\\HtmlTable10k.html"
# html_file_100 = "C:\\Your\\DirectoryPath\\HtmlTable100.html"
# html_file_1k = "C:\\Your\\DirectoryPath\\HtmlTable1k.html"


def enrich_html_column_headings(df_columns: Iterable[Any], html_str: str, js_data_tags: Dict[int, List[str]]) -> str:
    """
    ### Function replace_col_headings
        Update the html string so that the `<th>` tags include the desired data tags and the onclick call.

    - `df_columns`: An iterable containing the column headings.
    - `html_str`: The html string that needs parsing
    - `js_data_tags`: Dictionary carrying column position as key and the data tags for the column as a list of strings.

"""
    pos = 0
    for col_ in df_columns:
        col_ = col_.strip()  # removing any leading or trailing space - mirrors df.to_html
        search_pattern = re.compile(r'<th>' + col_ + r'</th>')
        onclick_str = f" onclick=\"sortTableColumn(event, {pos})\""
        data_tags = js_data_tags.get(pos, None)
        dt_str = (lambda x: " ".join(x) if data_tags else "")(data_tags)
        dt_str += onclick_str
        replacement_str = r'<th ' + dt_str + '>'+col_ + r'</th>'
        html_str = re.sub(pattern=search_pattern,
                          repl=replacement_str, string=html_str, count=1)
        pos += 1  # increment the column position number

    return html_str


if __name__ == "__main__":

    # dict keys map to the column table headers.
    # Define the javascript data tags - have to escape the quotes
    js_data_tags = {0: ["data-type=\"txt\"", "data-case-sensitive=\"true\""],
                    1: ["data-type=\"num\""],
                    2: ["data-type=\"num\""],
                    3: ["data-type=\"num\""],
                    4: ["data-type=\"num\""],
                    5: ["data-type=\"num\"", "data-dp=\".\""],
                    6: ["data-type=\"txt\"", "data-case-sensitive=\"false\""],
                    7: ["data-type=\"num\"", "data-dp=\".\""],
                    8: ["data-type=\"acc\"", "data-dp=\".\""],
                    9: ["data-type=\"acc\"", "data-dp=\",\""],
                    10: ["data-type=\"num\"", "data-dp=\",\""],
                    }

    # remove lfp prefix if running on your own machine
    df_all = pd.read_csv(lfp.file_to_upload, dtype="str")
    df_columns = df_all.columns
    # print(df_all.head(5))

    # Split the csv file into 100 and 1000 rows.
    df_100 = df_all[:100]
    df_1000 = df_all[:1000]

    # Covert df to html table with result held as a string...
    html_str = df_100.to_html(index=False, classes="table is-narrow is-hoverable", table_id=None, justify="center")
    # ..up the <th> to include any data tags and the onclick event
    html_str = enrich_html_column_headings(
        df_columns=df_columns, html_str=html_str, js_data_tags=js_data_tags)
    # save the file
    with open(lfp.html_file_100, 'w', encoding="utf-8") as file:
        file.write(html_str)

    # Repeat above for the 1k and 10k files
    html_str = df_1000.to_html(index=False, classes="table is-narrow is-hoverable", table_id=None, justify="center")
    html_str = enrich_html_column_headings(
        df_columns=df_columns, html_str=html_str, js_data_tags=js_data_tags)
    with open(lfp.html_file_1k, 'w', encoding="utf-8") as file:
        file.write(html_str)

    html_str = df_all.to_html(index=False, classes="table is-narrow is-hoverable", table_id=None, justify="left")
    html_str = enrich_html_column_headings(
        df_columns=df_columns, html_str=html_str, js_data_tags=js_data_tags)
    with open(lfp.html_file_10k, 'w', encoding="utf-8") as file:
        file.write(html_str)

    #10k rows but only first 2 columns
    df2col = df_all.loc[:, :df_columns[1]]
    html_str = df2col.to_html(index=False, classes="table is-narrow is-hoverable", table_id=None, justify="left")
    html_str = enrich_html_column_headings(
        df_columns=df_columns[0:2], html_str=html_str, js_data_tags=js_data_tags)
    with open(lfp.html_file_10k2col, 'w', encoding="utf-8") as file:
        file.write(html_str)

