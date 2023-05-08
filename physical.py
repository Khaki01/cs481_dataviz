import plotly.graph_objects as go
import numpy as np
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output, State

days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
running = [500, 600, 800, 700, 900, 750, 850]
cycling= [350, 400, 500, 450, 550, 600, 700]
workout = [600, 700, 650, 800, 750, 700, 900]
goal = [100, 312, 550, 816, 1114, 1447, 1819]
done = np.add(running, np.add(cycling, workout))



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
            id='activitydropdown',
            options=[
                {'label': 'All activities', 'value': 'all'},
                {'label': 'Running', 'value': 'running'},
                {'label': 'Cycling', 'value': 'cycling'},
                {'label': 'Workout', 'value': 'workout'},
            ],
            value='all',
            style={'width': '150px', 'margin-left': '20px'}
        ),
        html.Div([
            html.Label('End Goal(joul):',style={'margin-left': '20px'}),
            dcc.Slider(
                id='goalslider',
                min=2000,
                max=4500,
                step=250,
                value=0,
                marks={i: str(i) for i in range(10)},
                tooltip={"placement": "bottom", "always_visible": True}
            ),
        ], style={'width': '16%', 'margin-left': '20px', 'margin-top': '5px'}),
    ], style={'display': 'flex'}),
    dcc.Graph(
                id='plot', 
                style={'margin-top': '10px'}
            )
])


# define the callback function that updates the plot based on the dropdown value
@app.callback(
    Output('plot', 'figure'),
    Input('daysdropdown', 'value'),
    Input('activitydropdown', 'value'),
    Input('goalslider', 'value'),
    Input('plot', 'hoverData')
    )
def update_plot(daysdropdown, appsdropdown, goalslider, hoverData):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal) + (goalslider-2000))
    extra = np.subtract(done, goal1)
    daysdropdown = daysdropdown * -1
    days_subset = days[daysdropdown:]
    goal_subset = goal1[daysdropdown:]
    done_subset = done[daysdropdown:]
    extra_subset = extra[daysdropdown:]


    

    physical_data = []
    if appsdropdown != "all":
        if appsdropdown == 'running':
            physical_data = running[daysdropdown:]
        elif appsdropdown == 'cycling':
            physical_data = cycling[daysdropdown:]
        elif appsdropdown == 'workout':
            physical_data = workout[daysdropdown:]
        other_subset = np.subtract(done_subset, physical_data)
        trace3 = go.Bar(x=days_subset, y=physical_data, name=appsdropdown, marker=dict(color='orange'))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="Other Activities", marker=dict(color='green', opacity=0.2))
        data=[trace3, trace4]
        fig = go.Figure(data=data)
        #fig.add_trace(go.Scatter(x=days_subset, y=physical_data))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        


    else:
        physical_data = []
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]

        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(opacity = 0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra/left", marker=dict(color=colors, opacity = 0.7))
        if hoverData:
            point_index = hoverData['points'][0]['pointNumber']
            trace1['marker']['opacity'] = [0.7 if i != point_index else 1.0 for i in range(daysdropdown)]
            trace2['marker']['opacity'] = [0.7 if i != point_index else 1.0 for i in range(daysdropdown)]
        data=[trace1, trace2]
        fig = go.Figure(data=data)
        fig.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
    
        

    return fig

# start the app
if __name__ == '__main__':
    app.run_server(debug=True)
