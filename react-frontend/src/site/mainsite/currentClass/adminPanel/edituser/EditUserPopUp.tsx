import React, {useContext} from 'react';
import {Button, Dropdown, Form, FormControl, FormGroup, FormLabel, Modal} from "react-bootstrap";
import Member from "../../../../../data/user/Member";
import {UserServiceContext} from "../../../../Router";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {CurrentClass} from "../../ClassView";
import MemberRole from "../../../../../data/user/MemberRole";

const validationScheme = Yup.object().shape({
    displayName: Yup.string()
        .max(50, 'Der Benutzername darf nicht länger als 50 Zeichen sein')
        .required('Der Benutzername darf nicht leer sein'),
    role: Yup.string()
        .required('Die Rolle muss ausgefült sein')
})

const EditUserPopUp = ({member, onClose}: { member: Member, onClose: () => void }) => {
    const userService = useContext(UserServiceContext);
    const currentClass = useContext(CurrentClass)

    const handleSubmit = ({displayName, role}: { displayName: string, role: string }) => {
        userService.updateClassMember(currentClass!.id, {
            ...member,
            displayName,
            role: role as MemberRole
        }).then(onClose)
    }

    const formik = useFormik({
        initialValues: {
            displayName: member.displayName,
            role: member.role,
        },
        validationSchema: validationScheme,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false
    })
    return (
        <Modal show={true}>
            <Modal.Body>
                <Modal.Title>Benutzer bearbeiten</Modal.Title>
                <Form>
                    <FormGroup>
                        <FormLabel>Benutzername ändern</FormLabel>
                        <FormControl type={'text'} defaultValue={member.displayName} name={'displayName'}
                                     onChange={formik.handleChange}/>
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Dropdown onSelect={(e) => formik.setFieldValue('role', e!)}>
                            <Dropdown.Toggle>Rolle ändern</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    userService.getRolesBelow(member.role).map(val => (
                                        <Dropdown.Item key={val}
                                                       eventKey={val}>{userService.getMemberRole(val)}</Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'secondary'} onClick={onClose}>Schliessen</Button>
                <Button variant={'success'} onClick={() => formik.handleSubmit()}>Speichern</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserPopUp;