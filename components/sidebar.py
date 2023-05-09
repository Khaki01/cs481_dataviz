import dash_bootstrap_components as dbc
from dash import ClientsideFunction, Input, Output, State, dcc, html
from components.notifications import notifications

pathname_map = {
    "Task1-health-activity": "Physical activity",
    "Task1-phone-usage": "Phone usage",
    "Task3-calendar": "Calendar",
}

icon_map = {
    'Task1-health-activity': html.I(className="bi bi-activity", style={'color': '#697a8d', 'margin-right': '8px'}),
    "Task1-phone-usage": html.I(className="bi bi-phone", style={'color': '#697a8d', 'margin-right': '8px'}),
    "Task3-calendar": html.I(className="bi bi-calendar-check", style={'color': '#697a8d', 'margin-right': '8px'}),

}

SIDEBAR_STYLE = {
    "position": "fixed",
    "left": 0,
    "bottom": 0,
    "width": "16rem",
    "height": "100%",
    "zIndex": 1,
    "overflowX": "hidden",
    "padding": "1rem",
    "transition": "all 0.5s",
}

SIDEBAR_HIDDEN = {
    "position": "fixed",
    "left": "-16rem",
    "bottom": 0,
    "width": "16rem",
    "height": "100%",
    "zIndex": 1,
    "overflowX": "hidden",
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
            html.H2("2/cent", className="display-title"),
            html.Hr(),
            dbc.Nav(
                [
                    dbc.NavLink(
                        [icon_map[page['name']], f"{pathname_map[page['name']]}"],
                        href=f"{page['path']}",
                        active="exact",
                        id=f"{page['name']}",
                        style={"color": "#697a8d"}
                    )
                    for page in dash.page_registry.values()
                    if page["name"] != "Index"
                ],
                vertical=True,
                pills=True,
            ),
            notifications
        ],
        id="sidebar",
        className="sidebar",
    )
