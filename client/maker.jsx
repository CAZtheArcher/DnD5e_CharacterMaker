const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const apiURL = "https://www.dnd5eapi.co";

const raceDataset = JSON.parse(await fetch("https://www.dnd5eapi.co/api/races"));
const spellDataset = JSON.parse(await fetch("https://www.dnd5eapi.co/api/spells"));
const skillDataset = JSON.parse(await fetch("https://www.dnd5eapi.co/api/skills"));

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const power = e.target.querySelector('#domoPower').value;

    if(!name || !age || !power) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, power }, onDomoAdded);
    return false;
};

const handleRemove = (e, onDomoRemoved) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#domoName").value;

    if(!name) {
        helper.handleError('Name field is required!');
        return false;
    }

    helper.sendPost(e.target.action, { name }, onDomoRemoved);
    return false;
};

const handleCharacter = (e, onCharAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const power = e.target.querySelector('#domoPower').value;

    if(!name || !age || !power) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, power }, onCharAdded);
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

const CharForm = (props) => {
    const raceNodes = raceDataset["results"].map(races => {
        return(
            <option key={races.index} value={races.index}>{races.name}</option>
        );
    });
    const skillNodes = skillDataset["results"].map(skills => {
        return(
            <div key={skills.index}>
                <input type="checkbox" id="skillSelect" name={skills.name} value={skills.index}/>
                <label htmlFor={skills.name}>{skills.name}</label>
            </div>
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
            <label htmlFor="dropdownSelect">Race: </label>
            <select name="Race dropdown" id="RaceDropdownMenu">
                {raceNodes}
            </select>
            <h3>Skill Proficiencies</h3>
            {skillNodes}

            <input className="makeCharSubmit" type="submit" value="Make Char" />
        </form>
    );
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" placeholder='age' />

            <label htmlFor="power">PowLVL: </label>
            <input id="domoPower" type="number" min="0" name="power" placeholder='power level' />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
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

const RemoveDomoForm = (props) => {
    return(
        <form id="domoForm"
        onSubmit={(e) => handleRemove(e, props.triggerReload)}
            name="domoForm"
            action="/deleteDomo"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo to Remove" />
            <input className="makeDomoSubmit" type="submit" value="Remove Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return(
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoPower">Power Level: {domo.power}</h3>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
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
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
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
    const [reloadDomos, setReloadDomos] = useState(false);

    return(
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="makeDomo">
                <RemoveDomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;