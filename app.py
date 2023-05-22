import dash
import dash_bootstrap_components as dbc
from dash import dcc, html

from components.navbar import navbar
from components.sidebar import SIDEBAR_STYLE, sidebar

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

main = html.Div(
    id="page-content",
    className="page-content",
    children=[
        navbar,
        dcc.Store(id="side_click"),
        html.Div([
            dash.page_container
        ]),
    ],
)

app.layout = html.Main([sidebar(dash), main], className="main-outer-container")


if __name__ == "__main__":
    app.run_server(debug=True)
