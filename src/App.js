import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import {Grid, FormControl, TextField, InputLabel, Select, MenuItem} from '@material-ui/core/';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "30em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    selectEmpty: {
        marginTop: theme.spacing(3),
    },
    label: {
        height: "30px"
    }
}));


function App() {

    const classes = useStyles();

    /* Dimensional array used for currencies converting that can updated, in which the row represents the source currency,
    while the column represents the target currency */
    const currencies_table = [
        [1, 1/1.2897, 1/1.3135, 1/0.8631, 1/124.03, 1/1.56],
        [1.2897, 1, .9960, 1.29, 1/109.62, 1/1.33],
        [1.3135, 1/.9960, 1, 1.18, 1/115.1, 1/1.45],
        [0.8631, 1/1.29, 1/1.18, 1, 1/136.77, 1/1.7574],
        [124.03, 109.62, 115.1, 136.77, 1, 79.66],
        [1.56, 1.33, 1.45, 1.7574, 1/79.66, 1]
    ];

    // Maintain time in dataTime
    const [dateTime, setDateTime] = useState(new Date());

    // UTC in German format
    let formatter = new Intl.DateTimeFormat('de', { day:'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
    let utc = formatter.format(new Date());

    // Make moment of right now at the first rendering, using the device timezone
    useEffect(() => {
        const id = setInterval(() => setDateTime(new Date()), 60 * 1000);
        return () => {
            clearInterval(id);
        }
    }, []);

    // Index state to define the item index in the currencies array
    const [index, setIndex] = React.useState([0,1]);

    // Source and target menus states to handle the selection change
    const [source, setSource] = React.useState(0);
    const [target, setTarget] = React.useState(1);

    // Inputs state to handle the inputs' changes
    const [from, setFrom] = React.useState(1);
    const [to, setTo] = React.useState(1.2);

    // Calculate the new target whenever the user selects a new option
    useEffect(() => {
        let fromValue = from;
        setTo(parseFloat(fromValue * currencies_table[index[1]][index[0]]).toFixed(2));
    }, [index[0], index[1]]);

    // Handle changes (input fields + dropdown lists) using the handlers below, except when there is no input value
    const handleSourceChange = (event) => {
        if(event.target.value !== ""){
            setFrom(event.target.value);
            setTo(parseFloat(event.target.value * currencies_table[index[1]][index[0]]).toFixed(2));
        }
    }

    const handleTargetChange = (event) => {
        if (event.target.value !== "") {
            setTo(event.target.value);
            setFrom(parseFloat(event.target.value * currencies_table[index[0]][index[1]]).toFixed(2));
        }
    }

    const handleSourceMenuChange = (event) => {
        setSource(event.target.value);
        index[0] = event.target.value;
        setIndex(index);
    };

    const handleTargetMenuChange = (event) => {
        setTarget(event.target.value);
        index[1] = event.target.value;
        setIndex(index);
    };

    // Convert a given index to its corresponding currency
    const getChoice = (index) => {
        let choice;
        switch (index) {
            case 0: choice = "Euro"; break;
            case 1: choice = "US Dollar"; break;
            case 2: choice = "Schweizer Franken"; break;
            case 3: choice = "Britisch Pfund"; break;
            case 4: choice = "JPY"; break;
            case 5: choice = "CAD"; break;
        }
        return choice;
    }

  return (
      <div className={classes.root} >
          <Grid container spacing={1} className="wrapper">
              <div style={{padding: "4px"}}>
                  <InputLabel className="date-label">{`${from} ${getChoice(source)} equals`}&nbsp;</InputLabel>
                  <InputLabel style={{color:"black", fontSize:"30px"}}>  {to} {getChoice(target)}</InputLabel>
                  <br />
                  <InputLabel style={{fontSize: "12px"}} className="date-label">{`${utc} UTC`}</InputLabel>
              </div>

              <Grid container item xs={12} spacing={1}>
                  <Grid item xs={6}>
                      <TextField type="number" id="outlined-basic" variant="outlined" value={from} className="text-input"
                                 onChange={handleSourceChange}
                      />
                  </Grid>
                  <Grid item xs={6}>
                      <FormControl variant="outlined" >
                          <InputLabel id="source-label">Source</InputLabel>
                          <Select className="menu"
                              labelId="source"
                              id="source_id"
                              onChange={handleSourceMenuChange}
                              label="Source"
                              value={source}
                          >
                              <MenuItem value={0}>Euro</MenuItem>
                              <MenuItem value={1}>US Dollar</MenuItem>
                              <MenuItem value={2}>Schweizer Franken</MenuItem>
                              <MenuItem value={3}>Britisch Pfund</MenuItem>
                              <MenuItem value={4}>JPY</MenuItem>
                              <MenuItem value={5}>CAD</MenuItem>
                          </Select>
                      </FormControl>
                  </Grid>
              </Grid>
              <Grid container item xs={12} spacing={1}>
                  <Grid item xs={6}>
                      <TextField type="number" id="outlined-basic2" variant="outlined" className="text-input"
                                 value={to}
                                  onChange={handleTargetChange}
                      />
                  </Grid>
                  <Grid item xs={6}>
                      <FormControl variant="outlined">
                          <InputLabel id="target-label">Target</InputLabel>
                          <Select className="menu"
                              labelId="target"
                              id="target_id"
                              onChange={handleTargetMenuChange}
                              label="Target"
                              value={target}
                          >
                              <MenuItem value={0}>Euro</MenuItem>
                              <MenuItem value={1}>US Dollar</MenuItem>
                              <MenuItem value={2}>Schweizer Franken</MenuItem>
                              <MenuItem value={3}>Britisch Pfund</MenuItem>
                              <MenuItem value={4}>JPY</MenuItem>
                              <MenuItem value={5}>CAD</MenuItem>
                          </Select>
                      </FormControl>
                  </Grid>
              </Grid>
          </Grid>
      </div>
  );
}

export default App;
