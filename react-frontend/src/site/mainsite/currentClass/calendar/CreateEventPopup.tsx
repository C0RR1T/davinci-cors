import React, {useContext} from 'react';
import {Alert, Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {UserServiceContext} from "../../../Router";
import {CurrentClass} from "../ClassView";
import {useFormik} from "formik";
import EventType from "../../../../data/event/EventType";
import * as Yup from "yup";
import Datetime from "react-datetime";
import {Moment} from "moment";

type submitValues = {
    eventName: string,
    startDate: number,
    endDate?: number,
    description: string,
    eventType: EventType
}

const validationSchema = Yup.object().shape({
    eventName: Yup.string()
        .max(50, 'Der Name darf maximal 50 Zeichen lang sein')
        .required('Das Event muss einen Namen haben'),
    startDate: Yup.string()
        .required('Das Startdatum muss definiert sein'),
    endDate: Yup.number()
        .moreThan(Yup.ref('startDate'), 'Das Endatum muss nach dem Stardatum sein')
        .notRequired(),
    description: Yup.string()
        .notRequired(),
    eventType: Yup.string()
        .oneOf(['homework', 'holidays', 'exam', 'other'])
        .required('Der Typ muss ausgewählt sein')
})

const CreateEventPopup = () => {
    const userService = useContext(UserServiceContext);
    const currentClass = useContext(CurrentClass);
    const onSubmit = ({eventName, startDate, endDate, description, eventType}: submitValues) => {
        userService.createEvent(currentClass!.id, {
            name: eventName,
            start: new Date(startDate * 1000).getTime(),
            end: (endDate) ? new Date(endDate * 1000).getTime() : undefined,
            description: description,
            type: eventType,
        })
    }

    const formik = useFormik({
        initialValues: {
            eventName: '',
            startDate: 0,
            endDate: 0,
            description: '',
            eventType: 'other',
        },
        onSubmit: onSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        validationSchema: validationSchema
    })

    return (
        <Modal>
            <Modal.Body>
                <Modal.Title>Event erstellen</Modal.Title>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                }}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel>Name des Events</FormLabel>
                                <FormControl type="text" name="eventName" onChange={formik.handleChange}/>
                            </FormGroup>
                            <Alert variant={'danger'} show={!!formik.errors.eventName}>{formik.errors.eventName}</Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel>Startdatum</FormLabel>
                                <Datetime dateFormat={'DD.MM.YYYY'} timeFormat={'HH:mm'} locale={'de-ch'}
                                          onChange={moment => {
                                              if (typeof moment !== 'string')
                                                  formik.setFieldValue('startDate', (moment as Moment).unix())
                                          }}/>
                            </FormGroup>
                            <Alert variant={'danger'} show={!!formik.errors.startDate}>{formik.errors.startDate}</Alert>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel>Enddatum</FormLabel>
                                <Datetime dateFormat={'DD.MM.YYYY'} timeFormat={'HH:mm'} locale={'de-ch'}
                                          onChange={moment => {
                                              if (typeof moment !== 'string')
                                                  formik.setFieldValue('endDate', (moment as Moment).unix())
                                          }}/>
                            </FormGroup>
                            <Alert variant={'danger'} show={!!formik.errors.endDate}>{formik.errors.endDate}</Alert>
                        </Col>

                        <FormGroup>
                            <FormLabel>Beschreibung</FormLabel>
                            <FormControl as={'textarea'} name={'description'} rows={10}
                                         style={{resize: 'none', overflowY: 'auto'}} onChange={formik.handleChange}/>
                        </FormGroup>
                        <Alert variant={'danger'} show={!!formik.errors.description}>{formik.errors.description}</Alert>
                    </Row>
                    <br/>
                    <Row className={'text-center'}>
                        <Dropdown onSelect={(value) => formik.setFieldValue('eventType', value)}>
                            <Dropdown.Toggle>{getFormatted(formik.values.eventType)}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'homework'}>Hausaufgabe</Dropdown.Item>
                                <Dropdown.Item eventKey={'exam'}>Prüfung</Dropdown.Item>
                                <Dropdown.Item eventKey={'holidays'}>Ferien</Dropdown.Item>
                                <Dropdown.Item eventKey={'other'} default>Anderes</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'secondary'}>Abbrechen</Button>
                <Button variant={'success'} onClick={() => formik.handleSubmit()}>Speichern</Button>
            </Modal.Footer>
        </Modal>
    );
};

const getFormatted = (type: string): string => types[type];

const types: { [type: string]: string } = {
    'homework': 'Hausaufgabe',
    'holidays': 'Ferien',
    'exam': 'Prüfung',
    'other': 'Anderes',
}

export default CreateEventPopup;