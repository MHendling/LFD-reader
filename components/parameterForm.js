import React from 'react';
import classNames from 'classnames';
import {Classes} from "@blueprintjs/core";
import {Formik, Field, Form} from 'formik';

import styles from './parameterForm.module.css'

const ParameterForm = ({onSubmit}) =>
    (
        <Formik
            initialValues={{
                id: '',
                a: '',
                b: '',
                c: '',
                d: '',
            }}
            onSubmit={onSubmit}>
            <Form className={styles.form}>
                <label htmlFor="id">ID</label>
                <Field id="id" name="id"/>

                <label htmlFor="a">a</label>
                <Field id="a" name="a"/>

                <label htmlFor="b">b</label>
                <Field id="b" name="b"/>

                <label htmlFor="c">c</label>
                <Field id="c" name="c"/>

                <label htmlFor="d">d</label>
                <Field id="d" name="d"/>

                <button type="submit" className={classNames(Classes.BUTTON, Classes.INTENT_PRIMARY)}>Save</button>
            </Form>
        </Formik>
    );

export default ParameterForm;