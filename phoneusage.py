import plotly.graph_objects as go
import numpy as np
import dash
from dash import dcc
from dash import html

days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
goal = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
insta = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
tiktok = [1, 1.2, 1.5, 1.4, 0.2, 0.3, 1.]
play = [0.1, 0.3, 0.4, 0.6, 1.5, 0, .35]
done = np.add(insta, np.add(tiktok, play))


# create a Dash app
app = dash.Dash(__name__)

# define the layout of the app
app.layout = html.Div([
    html.Div([
        
        dcc.Dropdown(
            id='daysdropdown',
            options=[
                {'label': '1 week', 'value': 7},
                {'label': '5 days', 'value': 5},
                {'label': '3 days', 'value': 3},
            ],
            value=7,
            style={'width': '150px', 'margin-left': '20px'}
        ),
        dcc.Dropdown(
            id='appsdropdown',
            options=[
                {'label': 'All apps', 'value': 'all'},
                {'label': 'TikTok', 'value': 'tiktok'},
                {'label': 'Instagram', 'value': 'insta'},
                {'label': 'Play Market', 'value': 'play'},
            ],
            value='all',
            style={'width': '150px', 'margin-left': '20px'}
        ),
        html.Div([
            html.Label('End Goal(hour):',style={'margin-left': '20px'}),
            dcc.Slider(
                id='goalslider',
                min=0,
                max=10,
                step=1,
                value=0,
                marks={i: str(i) for i in range(11)},
                tooltip={"placement": "bottom", "always_visible": True}
            ),
        ], style={'width': '16%', 'margin-left': '20px', 'margin-top': '5px'}),
    ], style={'display': 'flex'}),
    dcc.Graph(id='plot', style={'margin-top': '10px'},hoverData={'points': [{'pointNumber': None}]})
])


# define the callback function that updates the plot based on the dropdown value
@app.callback(
    dash.dependencies.Output('plot', 'figure'),
    dash.dependencies.Input('daysdropdown', 'value'),
    dash.dependencies.Input('appsdropdown', 'value'),
    dash.dependencies.Input('goalslider', 'value'),
    dash.dependencies.Input('plot', 'hoverData')
    )
def update_plot(daysdropdown, appsdropdown, goalslider, hoverData):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal) + goalslider)
    extra = np.subtract(done, goal1)
    daysdropdown = daysdropdown * -1
    days_subset = days[daysdropdown:]
    goal_subset = goal1[daysdropdown:]
    done_subset = done[daysdropdown:]
    extra_subset = extra[daysdropdown:]

    app_data = []
    if appsdropdown != "all":
        if appsdropdown == 'tiktok':
            app_data = tiktok[daysdropdown:]
        elif appsdropdown == 'insta':
            app_data = insta[daysdropdown:]
        elif appsdropdown == 'play':
            app_data = play[daysdropdown:]
        other_subset = np.subtract(done_subset, app_data)

        colors3 = ["orange"]*7
        colors4 = ["green"] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData['points'][0]['pointNumber']
            if point_number is not None:
                colors3[point_number] = 'dark' + colors3[point_number]
                colors4[point_number] = 'dark' + colors4[point_number]

        trace3 = go.Bar(x=days_subset, y=app_data, name=appsdropdown, marker=dict(color=colors3))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="Other Apps", marker=dict(color=colors4, opacity = 0.2))
        fig = go.Figure(data=[trace3, trace4])
        #fig.add_trace(go.Scatter(x=days_subset, y=app_data))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig
    else:
        app_data = []
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]
        colors1 = ['rgba(0, 0, 255, 0.7)'] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData['points'][0]['pointNumber']
            if point_number is not None:
                colors[point_number] = 'dark' + colors[point_number]
                colors1[point_number] = 'rgba(0, 0, 255, 0.9)'   
        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=colors1, opacity = 0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra", marker=dict(color=colors, opacity = 0.7))
        fig = go.Figure(data=[trace1, trace2])
        fig.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig

# start the app
if __name__ == '__main__':
    app.run_server(debug=True)
