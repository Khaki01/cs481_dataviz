import dash
from dash import html, dcc, callback, Output, Input
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import plotly.express as px
import numpy as np
import plotly.figure_factory as ff

dash.register_page(
    __name__,
    path='/health-activity',
    title='Health activity',
    image='logo.png',
    description='Explore health activity'
)

fig = go.Figure()

x1 = np.random.randn(200) - 1
x2 = np.random.randn(200) - 0.5
x3 = np.random.randn(200) + 0.5
x4 = np.random.randn(200) + 1

hist_data = [x1, x2, x3, x4]
hist_data_total = [[sum(x) for x in zip(*hist_data)]]
group_labels = ['Group 1', 'Group 2', 'Group 3']

colors = px.colors.sequential.Plasma[:5]

x1_abs = np.absolute(np.sum(x1, dtype=int))
x2_abs = np.absolute(np.sum(x2, dtype=int))
x3_abs = np.absolute(np.sum(x3, dtype=int))
x4_abs = np.absolute(np.sum(x4, dtype=int))

total = x1_abs + x2_abs + x3_abs + x4_abs

x_data = [[x1_abs * 100 / total, x2_abs * 100 / total, x3_abs * 100 / total, x4_abs * 100 / total]]

y_data = ['Instagram', 'Kakao talk', 'Youtube', 'Tiktok']

for i in range(0, len(x_data[0])):
    for k, (xd, yd) in enumerate(zip(x_data, y_data)):
        fig.add_trace(go.Bar(
            x=[xd[i]], y=[yd],
            orientation='h',
            marker=dict(
                color=colors[i],
                line=dict(color='rgb(248, 248, 249)', width=1)
            )
        ))

fig.update_layout(
    width=500,
    height=220,
    xaxis=dict(
        showline=False,
        showticklabels=False,
    ),
    yaxis=dict(
        showline=False,
        showticklabels=False,
    ),
    barmode="stack",
    paper_bgcolor='rgb(248, 248, 255)',
    plot_bgcolor='rgb(248, 248, 255)',
)

fig.add_vrect(x0=-1.5, x1=101.5)
fig.add_vline(x=80, line_color="red", annotation=dict(x=87.5, y=1.5), fillcolor="red", line_dash="dot",
              annotation_position="top left", annotation_text="100%")


@callback(Output("distplot", "figure", allow_duplicate=True), Input("barplot", 'clickData'),
          config_prevent_initial_callbacks=True)
def update_graph(clickData):
    label = clickData['points'][0]['label']
    newplot = ff.create_distplot([*hist_data_total,])
    # dist_plot.add_scatter(x=hist_data[0], y=group_labels[0], fill="tozeroy", fillcolor="red")
    return clickData


dist_plot = ff.create_distplot(hist_data_total, ["Phone usage"], show_hist=False, show_rug=False, colors=colors)

layout = html.Div([
    dbc.Card([
        dbc.CardHeader("Phone usage"),
        dbc.CardBody([
            html.H4("Explore phone usage")
        ]),
        dbc.Card([dcc.Graph(id="distplot", figure=dist_plot)]),
        dbc.Card([dcc.Graph(id="barplot", figure=fig)]),
    ])
])

