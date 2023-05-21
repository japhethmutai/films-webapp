import React from 'react';
import { useFetchUser } from '../../lib/authContext';
import Register from '@/components/Register';
import Layout from '@/components/Layout';

const RegisterPage = () => {
	const { user, loading } = useFetchUser();

	return (
		<Layout user={user}>
			<Register />
		</Layout>
	)
}

export default RegisterPage;