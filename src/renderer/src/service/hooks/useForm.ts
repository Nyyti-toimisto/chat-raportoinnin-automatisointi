import { useState } from 'react';

export const useCustomForm = (initialValues: any) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event: any) => {
    try {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return { values, handleChange };
};
