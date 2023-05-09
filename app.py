import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
from dash.dependencies import Input, Output, State

from components.navbar import navbar
from components.sidebar import SIDEBAR_HIDDEN, SIDEBAR_STYLE, sidebar

# external CSS stylesheets
external_stylesheets = [
    "https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
]

app = dash.Dash(
    __name__,
    use_pages=True,
    external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.BOOTSTRAP]
    + external_stylesheets,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"},
    ],
)

CONTENT_STYLE = {
    "transition": "marginLeft .5s",
    "marginLeft": "16rem",
    "height": "100%",
}
CONTENT_HIDDEN = {
    "transition": "marginLeft .5s",
}


@app.callback(
    [
        Output("sidebar", "style"),
        Output("page-content", "style"),
        Output("side_click", "data"),
    ],
    [Input("btn_sidebar", "n_clicks")],
    [
        State("side_click", "data"),
    ],
)
def toggle_sidebar(n, nclick):
    if n:
        if nclick == "SHOW":
            # sidebar_style = SIDEBAR_HIDDEN
            content_style = CONTENT_HIDDEN
            cur_nclick = "HIDDEN"
        else:
            sidebar_style = SIDEBAR_STYLE
            content_style = CONTENT_STYLE
            cur_nclick = "SHOW"
    else:
        sidebar_style = SIDEBAR_STYLE
        content_style = CONTENT_STYLE
        cur_nclick = "SHOW"

    return sidebar_style, content_style, cur_nclick


main = html.Div(
    id="page-content",
    className="page-content",
    # style=CONTENT_STYLE,
    children=[
        navbar,
        dcc.Store(id="side_click"),
        html.Div([dash.page_container], style={"padding": "1rem"}),
    ],
)

app.layout = html.Main([sidebar(dash), main], className="main-outer-container")


if __name__ == "__main__":
    app.run_server(debug=True)
