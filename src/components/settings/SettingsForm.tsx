'use client';

import React from "react";
import {useFormik} from "formik";
import {Button, FormControl, FormLabel, Input} from "@chakra-ui/react";

interface Props {
  defaultName: string;
  onSubmit: (message: string) => Promise<void>;
}

export function SettingsForm({ defaultName, onSubmit }: Props) {
  const formik = useFormik({
    initialValues: {
      name: defaultName,
    },
    onSubmit: async (values) => {
      await onSubmit(values.name).then(res => console.log(res)).catch(e => console.error(e));
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          id='name'
          name='name'
          type='text'
          onChange={formik.handleChange}
          value={formik.values.name}
          placeholder='name'
        />
      </FormControl>
      <Button type="submit">Save</Button>
    </form>
  )
}