import React, { useCallback, useEffect, useState } from "react";
import Button from "../../Components/Button";
import LoadingSpinner from "../../Components/LoadingSpinner";
import Modal from "../../Layout/ModalComponents/Modal";
import classes from "./Faq.module.css";
import * as Icon from "react-bootstrap-icons";
import User, { UserRole } from "../../Lib/User";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import { NotificationManager } from "react-notifications";

export interface QuestionType {
    answer: string,
    askerId: number,
    hierarchy: number,
    id: number,
    isAnswered: boolean,
    question: string
}

const Faq = () => {
    const [questions, setQuestions] = useState<Array<QuestionType>>();
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [question, setQuestion] = useState<QuestionType>();

    const [isActive, setIsActive] = useState(false)
    const navigate = useNavigate();

    const getQuestionsRes = useCallback(async (forceFetch?: boolean): Promise<Response> => {
        let link = "";
        if(forceFetch || isActive)
            switch(User.role){
                // Change to Faq when it is implemented in backend
                case UserRole.Moderator: link = "unanswered"; break;
                case UserRole.User: link = "my-questions"; break;
            };
        return fetch(
            `${process.env.REACT_APP_REQUEST_URL}/faq/${link}`, 
            { 
                method: 'GET', 
                credentials: "include" 
            }
        );
    }, [isActive]);

    const areQestionsOk = useCallback(async () => {
        return getQuestionsRes(true)
        .then(res => res.json())
        .then(json => json.length !== 0)
    }, [getQuestionsRes]);

    const solveMenu = useCallback(async () => {
        if((await areQestionsOk()))
            setShowMenu(true);
        else
            setShowMenu(false);
    }, [areQestionsOk]);

    const getQuestions = useCallback(async () => {
        setIsLoading(true);
        getQuestionsRes()
        .then(res => res.json())
        .then(json => setQuestions(json))
        .finally(() => setIsLoading(false))
    }, [getQuestionsRes])

    const editQuestion = (id: number) => {
        setModalContent('editquestion');
        if(questions === undefined) return;
        const question = questions?.filter(obj => obj.id === id)[0];
        setQuestion(question);
        setShowModal(true);
    }

    const deleteQuestion = (id: number) => {
        fetch(`${process.env.REACT_APP_REQUEST_URL}/faq/`, 
            { 
                method: 'DELETE', 
                credentials: "include",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({questionId: id}),
            })
            .then(res => { 
                if(res.ok)
                    NotificationManager.success('Udało się usunąć pytanie.', 'Sukces!', 3000);
                else
                    throw new Error("Response error");
                }
            )
            .finally(() => getQuestions())
            .catch(() => NotificationManager.error('Coś poszło nie tak.', 'Błąd!', 3000))
    }

    const closeModal = () => {
        setShowModal(false);
    };

    function changeListType(active?: boolean) {
        setIsActive(active !== undefined ? active : !isActive);
    }

    useEffect(() => {
        getQuestions(); 
        solveMenu()
    }, [getQuestions, solveMenu]);

    return (<>
        {showModal && (
            <Modal
            onBgClick={closeModal}
            onClose={closeModal}
            question={question}
            modalContent={modalContent}
            />
        )}
        <h1 className={classes.heading}>FAQ</h1>
        {showMenu && (
            <div className={classes.menu}>
                <div className={classes.managementIcons}>
                    <div className={isActive ? "" : classes.active}
                        onClick={() => changeListType(false)}>
                        <Icon.CheckCircleFill />
                        <span>Z odpowiedzią</span>
                    </div>
                    <div className={isActive ? classes.active : ""}
                        onClick={() => changeListType(true)}>
                        <Icon.QuestionCircleFill />
                        <span>Bez odpowiedzi</span>
                    </div>
                </div>
            </div>
        )}
        <ol className={classes.questionsList}>
        {isLoading || (questions?.length !== 0 && questions?.map((quest, key) => {return(
            <li key={key} className={classes.questionElem}>
                <div className={classes.questionCont}>
                    {/* TODO: User.isFaq() && <>
                        <span className={classes.hierarchyMan}>
                            <Icon.ArrowUpCircleFill className={classes.hierarchyIcon} />
                            <p>{quest.hierarchy}</p>
                            <Icon.ArrowDownCircleFill className={classes.hierarchyIcon} />
                        </span>
                    </>*/}
                    <span className={classes.dataSubcont}>
                        <p className={classes.question}>{quest.question}</p>
                        <p className={classes.answer}>{quest.answer}</p>
                    </span>
                    {User.isFaq() && <>
                        <span className={classes.iconCont} onClick={() => editQuestion(quest.id)}>
                            <Icon.PencilFill className={classes.icon} />
                        </span>
                        <span className={classes.iconCont} onClick={() => deleteQuestion(quest.id)}>
                            <Icon.Trash3Fill className={classes.icon} />
                        </span>
                    </>}
                </div>
            </li>
        )}))
        }
        </ol>
        {isLoading && <LoadingSpinner />}

        <div>
            <p className={classes.buttonDesc}>Nie ma tutaj nurtującego Cię pytania?</p>
            <div className={classes.buttonCont}>
            {User.isLogged ? (
                <Button buttonText="Zadaj pytanie" onClick={
                    () => {
                    setShowModal(true);
                    setModalContent("addquestion");
                    }
                } />
                ) : (
                <Button
                    buttonText="Zaloguj się aby uzyskać dostęp"
                    onClick={() => {
                    navigate("/auth/login")
                    }}
                />
                )}
            </div>
        </div>
    </>)
}

export default Faq;