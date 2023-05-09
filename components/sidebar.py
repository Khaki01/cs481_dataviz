import dash_bootstrap_components as dbc
from dash import html

pathname_map = {
    "Task1-health-activity": "Physical activity",
    "Task1-phone-usage": "Phone usage",
    "Task3-calendar": "Calendar exploration",
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
    "borderRight": "0.5px solid",
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
    return html.Div(
        [
            html.H2("2/cent", className="display-4"),
            html.Hr(),
            dbc.Nav(
                [
                    dbc.NavLink(
                        f"{pathname_map[page['name']]}",
                        href=f"{page['path']}",
                        active="exact",
                    )
                    for page in dash.page_registry.values()
                    if page["name"] != "Index"
                ],
                vertical=True,
                pills=True,
            ),
        ],
        id="sidebar",
        style=SIDEBAR_STYLE,
    )
