import React, { useState } from "react";
import classes from "./Settings.module.css"
import Section from "../../Layout/Section";
import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import Button from "../../Components/Button";
import turtle from "./Graphics/turtle.jpg"
import { BrightnessHighFill, MoonFill, PencilFill } from "react-bootstrap-icons";
import Checkbox from "../../Components/Checkbox";

const Settings = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    return (
        <>
            <Section>
                <h2>Profil</h2>
                <div className={classes.twoInputs}>
                    <Input placeholder="Nazwa użytkownika"/>
                    <Button buttonText="Zmień hasło"/>
                </div> 
                <div className={classes.twoInputs}>
                    <Input placeholder="Link do konta facebook"/>
                    <Input placeholder="Link do konta instagram"/>
                </div> 
                <div className={classes.twoInputs}>
                    <Input placeholder="Link do kanału na youtube" />
                    <Input placeholder="Link do strony internetowej"/>
                </div> 
                <div className={classes.twoInputs}>
                    <div className={classes.inputHolder}>
                        <Textarea placeholder="Opis profilu" />
                    </div>
                    <div className={classes.inputHolder}>
                        <div className={classes.avatar}>
                            <span className={`${classes.coverer} ${classes.hidden}`}>
                                <PencilFill className={classes.covererIcon}  />
                            </span>
                            <img className={classes.avImage} src={turtle} alt="" />
                        </div>
                    </div> 
                </div> 
            </Section> 
            <Section>
                <h2>Preferencje</h2>
                <div className={classes.inliner}>
                    <div className={classes.switchContainer}>
                        <div className={classes.themeSwitch} onClick={()=>{setDarkTheme(!darkTheme)}}>
                            <div className={`${classes.ballWrapper} ${darkTheme ? classes.right : classes.left}`}>
                                <BrightnessHighFill className={darkTheme || classes.current} /> 
                                <MoonFill className={darkTheme && classes.current} />
                            </div>
                        </div>
                        <label htmlFor="" className={classes.label}>
                            Ciemny motyw
                        </label>
                    </div>
                    <Checkbox label="Weryfikacja dwuetapowa" />
                </div>
            </Section> 
            <Section>
                <h2>Dziennik</h2>
            </Section> 
            <Section>
                <h2>Konto</h2>
            </Section> 
        </>
    );
}

export default Settings;