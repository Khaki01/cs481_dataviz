# Olzhas
import dash_bootstrap_components as dbc
from dash import ClientsideFunction, Input, Output, html
from components.notifications import notifications

pathname_map = {
    "Task1-health-activity": "Physical activity",
    "Task1-phone-usage": "Phone usage",
    "Task3-calendar": "Calendar",
}
ICON_STYLE = {
    'display': 'inline-block', 'padding': 0, 'marginRight': '8px'
}

icon_map = {
    'Task1-health-activity': html.I(className="bi bi-activity nav-link", style=ICON_STYLE),
    "Task1-phone-usage": html.I(className="bi bi-phone nav-link", style=ICON_STYLE),
    "Task3-calendar": html.I(className="bi bi-calendar-check nav-link", style=ICON_STYLE),
}

SIDEBAR_STYLE = {
    "position": "fixed",
    "left": 0,
    "bottom": 0,
    "width": "16rem",
    "height": "100%",
    "zIndex": 1,
    "overflowX": "hidden",
    "padding": "24px 16px",
    "transition": "all 0.5s",
}

def sidebar(dash):
    dash.clientside_callback(
        ClientsideFunction(
            namespace="clientside", function_name="initial_params_function"
        ),
        Output("testDiv", "style", allow_duplicate=True),
        Input("Task3-calendar", "n_clicks"),
        prevent_initial_call=True,
    )
    return html.Div(
        [
            html.H2([html.A("2/cent", href="/", style={'all': 'unset'})], className="sidebar-title", style={'cursor': 'pointer'}),
            dbc.Nav(
                [
                    dbc.NavLink(
                        [icon_map[page["name"]], f"{pathname_map[page['name']]}"],
                        href=f"{page['path']}",
                        active="exact",
                        id=f"{page['name']}",
                    )
                    for page in dash.page_registry.values()
                    if page["name"] != "Index"
                ],
                vertical=True,
                pills=True,
            ),
            notifications,
        ],
        id="sidebar",
        className="sidebar",
        style=SIDEBAR_STYLE
    )
