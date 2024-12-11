const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { select } = require('underscore');

const apiURL = "https://www.dnd5eapi.co";
const open5eURL = "https://api.open5e.com/";

const raceList = JSON.parse(await fetch("https://www.dnd5eapi.co/api/races/"));
const raceDataset = JSON.parse(await fetch("https://api.open5e.com/races/"));
const backgroundDataset = JSON.parse(await fetch("https://api.open5e.com/backgrounds/"));
const spellDataset = JSON.parse(await fetch("https://api.open5e.com/spells/"));
const skillDataset = JSON.parse(await fetch("https://www.dnd5eapi.co/api/skills"));
const classDataset = JSON.parse(await fetch("https://api.open5e.com/classes/"));

for(let i=0; i < raceDataset.resilts.length(); i){
    let isPresent = false;
    for(let j=0; j < raceList.length(); j++){
        if(raceDataset.results[i].slug.includes(raceList.results[j].index)){
            isPresent = true;
        }
    }
    if(isPresent){
        i++;
    }
    else{
        raceDataset.results.splice(i,i);
    }
}

const handleCharacter = (e, onCharAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#charName').value;
    const age = e.target.querySelector('#charAge').value;
    const level = e.target.querySelector('#charLevel').value;
    const dnd5eClass = e.target.querySelector('#charClass').value;
    const race = e.target.querySelector('#charRace').value;
    const background = e.target.querySelector('#charBackground').value;
    const str = e.target.querySelector('#strStat').value;
    const dex = e.target.querySelector('#dexStat').value;
    const con = e.target.querySelector('#conStat').value;
    const int = e.target.querySelector('#intStat').value;
    const wis = e.target.querySelector('#wisStat').value;
    const cha = e.target.querySelector('#chaStat').value;
    const skills = e.target.querySelectorAll('#skillSelect');
    const proficiencies = [];

    for(let i=0; i < 10; i++){
        if(skills[i].value = true){
            proficiencies.add(skills[i].name);
        }
    }

    if(!name || !age || !power) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, level, dnd5eClass, race, background, str, dex, con, int, wis, cha }, onCharAdded);
    return false;
};

const handleCharRemove = (e, onCharRemoved) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#charName").value;

    if(!name) {
        helper.handleError('Name field is required!');
        return false;
    }

    helper.sendPost(e.target.action, { name }, onCharRemoved);
    return false;
};

const DropdownInFormExample = (props) => {
    return(
        <form id="charForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="exForm"
        >
            <label htmlFor="dropdownSelect">Choose 1: </label>
            <select name="Example dropdown" id="ExampleDropdownMenu">
                <option value="1">Example option 1</option>
                <option value="2">Example option 2</option>
                <option value="3">Example option 3</option>
            </select>
        </form>
    );
};

const SkillInfo = (props) => {
    //variables: race, bkgrnd, dnd5eClass
    let hasClass = 0;
    let hasRace = 0;
    let hasBackground = 0;

    for(let i=0; i < raceDataset.results.length(); i++){
        if(raceDataset.results[i].name == props.race){
            hasRace = i+1;
        }
    }
    for(let i=0; i < classDataset.results.length(); i++){
        if(classDataset.results[i].name == props.dnd5eClass){
            hasClass = i+1;
        }
    }
    for(let i=0; i < backgroundDataset.results.length(); i++){
        if(classDataset.results[i].name == props.bkgrnd){
            hasBackground = i+1;
        }
    }

    const skillNodes = skillDataset["results"].map(skills => {
        if( hasClass > 0 || hasRace > 0 || hasBackground > 0 ){
            if(
            raceDataset.results[hasRace - 1].traits.include(skills.name) || //race specific skills
            raceDataset.results[hasRace - 1].traits.include("of your choice") || //race says choice of any
            classDataset.results[hasClass - 1].prof_skills.includes(skills.name) || //class specific skills
            backgroundDataset.results[hasBackground - 1].skill_proficiencies.includes(skills.name) //background skills
            ){
                return(
                    <div key={skills.index}>
                        <input type="checkbox" id="skillSelect" name={skills.name} value={skills.index}/>
                        <label htmlFor={skills.name}>{skills.name}</label>
                    </div>
                );
            }
        }
    });
    return(
        {skillNodes}
    );
};

const D6DiceRoll = () => {
    let result = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
    let least = 50;
    let leastPosition = 5;
    for(let i=0; i < 4; i++){
        if(result[i] < least){
            least = result[i];
            leastPosition = i;
        }
    }
    result.splice(leastPosition, leastPosition);
    return result;
};

const StatSelection = (props) => {
    return(
        <div>
            <select name="str" id="strStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
            <select name="dex" id="dexStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
            <select name="con" id="conStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
            <select name="int" id="intStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
            <select name="wis" id="wisStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
            <select name="cha" id="chaStat">
                <option value="1">Value 1</option>
                <option value="2">Value 2</option>
                <option value="3">Value 3</option>
                <option value="4">Value 4</option>
                <option value="5">Value 5</option>
                <option value="6">Value 6</option>
            </select>
        </div>
    );
}

const StatsDisplay = (stats) => {
    return(
        <div>
            <h4 id='stat1'>{stats[0]}</h4>
            <h4 id='stat2'>{stats[1]}</h4>
            <h4 id='stat3'>{stats[2]}</h4>
            <h4 id='stat4'>{stats[3]}</h4>
            <h4 id='stat5'>{stats[4]}</h4>
            <h4 id='stat6'>{stats[5]}</h4>
        </div>
    );
};

const Stat4d6 = (props) => {
    let stats = [D6DiceRoll, D6DiceRoll, D6DiceRoll, D6DiceRoll, D6DiceRoll, D6DiceRoll];
    return(
        <div>
            {StatsDisplay(stats)}
            {StatSelection}
        </div>
    );
};

const StatPointBuy = (props) => {
    let stats = [8,8,8,8,8,8];
    let pointPool = 27;
    const decreaseStat = (statDecrease) => {
        if(stats[statDecrease] > 13){
            stats[statDecrease] -= 1;
            pointPool += 2;
        }
        else if(stats[statDecrease] < 9){
            stats[statDecrease] += 0;
            pointPool += 0;
        }
        else{
            stats[statDecrease] -= 1;
            pointPool += 1;
        }
    };
    const increaseStat = (statIncrease) => {
        if(stats[statIncrease] > 13){
            stats[statIncrease] += 1;
            pointPool -= 2;
        }
        else if(stats[statIncrease] > 15){
            stats[statIncrease] += 0;
            pointPool += 0;
        }
        else{
            stats[statIncrease] += 1;
            pointPool -= 1;
        }
    };
    return(
        <div>
            <div>
                <h4 id='stat1'>{stats[0]}</h4>
                <button onClick={}></button>
                <h4 id='stat2'>{stats[1]}</h4>
                <h4 id='stat3'>{stats[2]}</h4>
                <h4 id='stat4'>{stats[3]}</h4>
                <h4 id='stat5'>{stats[4]}</h4>
                <h4 id='stat6'>{stats[5]}</h4>
            </div>
            {StatSelection}
        </div>
    );
};

const StatStandardArray = (props) => {
    let stats = [15,14,13,12,10,8];
    return(
        <div>
            {StatsDisplay(stats)}
            {StatSelection}
        </div>
    );
};

const renderStatSwitch = (params) => {

    switch(params){
        case "4d6":
            return(<Stat4d6 />);
            break;
        case "pointBuy":
            return(<StatPointBuy />);
            break;
        case "standardArray":
            return(<StatStandardArray />);
            break;
        default:
            return(<Stat4d6 />);
            break;
    }
};

const CharForm = (props) => {
    const [formInfo, setFormInfo] = useState({});
    // use <page1 /> and <page2 /> refer to init function in login.jsx
    const [raceInfo, setRaceInfo] = useState({});
    const [classInfo, setClassInfo] = useState({});
    const [backgroundInfo, setBackgroundInfo] = useState({});
    const [statInfo, setStatInfo] = useState({});


    const classNodes = classDataset["results"].map(classes => {
        return(
            <option key={classes.name} value={classes.name}>{classes.name}</option>
        );
    });
    const raceNodes = raceDataset["results"].map(races => {
        return(
            <option key={races.index} value={races.index}>{races.name}</option>
        );
    });
    const backgroundNodes = backgroundDataset["results"].map(bkgrnd => {
        return(
            <option key={bkgrnd.name} value={bkgrnd.name}>{bkgrnd.name}</option>
        );
    });
    const spellNodes = spellDataset["results"].map(spells => {
        return(
            <div key={spells.index}>
                <input type="checkbox" id="spellSelect" name={spells.name} value={spells.index}/>
                <label htmlFor={spells.name}>{spells.name}</label>
                <label htmlFor={spells.name}>Level: {spells.level}</label>
            </div>
        );
    });

    return(
        <form id="charForm"
            onSubmit={(e) => handleCharacter(e, props.triggerReload)}
            name="charForm"
            action="/maker"
            method="POST"
            className="charForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="charName" type="text" name="name" placeholder="Character Name" />
            <label htmlFor="age">Age: </label>
            <input id="charAge" type="number" min="0" name="age" placeholder='age' />
            <label htmlFor="level">Level: </label>
            <input id="charLevel" type="number" min="1" max="20" name="level" placeholder='level' />
            <select name="Class dropdown" id="charClass" onChange={setClassInfo(e.target.value)}>
                {classNodes}
            </select>
            <label htmlFor="dropdownSelect">Race: </label>
            <select name="Race dropdown" id="charRace" onChange={setRaceInfo(e.target.value)}>
                {raceNodes}
            </select>
            <select name="Background dropdown" id="charBackground" onChange={setBackgroundInfo(e.target.value)}>
                {backgroundNodes}
            </select>
            if(raceInfo || classInfo || backgroundInfo){
                <div>
                    <h3>Skill Proficiencies</h3>
                    <SkillInfo race={raceInfo} bkgrnd={backgroundInfo} dnd5eClass={classInfo} />
                </div>
            }
            <select name="StatRoll" id="StatSelect" onChange={setStatInfo(e.target.value)}>
                <option value="4d6">4d6 Drop Lowest</option>
                <option value="pointBuy"> Point Buy</option>
                <option value="standardArray">Standard Array</option>
            </select>
            { renderStatSwitch(statInfo) }
            <input className="makeCharSubmit" type="submit" value="Make Char" />
        </form>
    );
};

const RemoveCharForm = (props) => {
    return(
        <form id="charRemoveForm"
        onSubmit={(e) => handleCharRemove(e, props.triggerReload)}
            name="charRemoveForm"
            action="/deleteChar"
            method="POST"
            className="charRemoveForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="charName" type="text" name="name" placeholder="Character to Remove" />
            <input className="makeCharSubmit" type="submit" value="Remove Char" />
        </form>
    );
};

const CharList = (props) => {
    const [chars, setChars] = useState(props.character);

    useEffect(() => {
        const loadCharsFromServer = async () => {
            const response = await fetch('/getChars');
            const data = await response.json();
            setChars(data.character);
        };
        loadCharsFromServer();
    }, [props.reloadChars]);

    if(chars.length === 0){
        return (
            <div className="charList">
                <h3 className="emptyChar">No Characters Yet!</h3>
            </div>
        );
    }

    const charNodes = chars.map(char => {
        return(
            <div key={char.id} className="char">
                <h3 className="charName">Name: {char.name}</h3>
                <h3 className="charLevel">Level: {char.level}</h3>
                <h3 className="charRace">Race: {char.race}</h3>
                <h3 className="charClass">Class: {char.class}</h3>
            </div>
        );
    });

    return(
        <div className="charList">
            {charNodes}
        </div>
    );
};

const App = () => {
    const [reloadChars, setReloadChars] = useState(false);

    return(
        <div>
            <div id="makeChar">
                <CharForm triggerReload={() => setReloadChars(!reloadChars)} />
            </div>
            <div id="makeChar">
                <RemoveCharForm triggerReload={() => setReloadChars(!reloadChars)} />
            </div>
            <div id="characters">
                <CharList chars={[]} reloadChars={reloadChars} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;