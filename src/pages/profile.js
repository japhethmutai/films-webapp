import Layout from '@/components/Layout';
import React, { useState } from 'react';
import { useFetchUser } from '../../lib/authContext';
import { getIdFromLocalCookie, getTokenFromServerCookie } from '../../lib/auth';
import { fetcher } from '../../lib/api';
import { useRouter } from 'next/router';

const ProfilePage = ({ avatar }) => {
    const { user, laoding } = useFetchUser();
	const [image, setImage] = useState(null);
  	const router = useRouter();

	const uploadToClient = (event) => {
		if (event.target.files && event.target.files[0]) {
			const tmpImage = event.target.files[0];
			setImage(tmpImage);
		}
	}
	const uploadToServer = async () => {
		const formData = new FormData();
		const file = image;
		formData.append('inputFile', file);
		formData.append('user_id', await getIdFromLocalCookie());
		try {
			const responseData = await fetcher('/api/upload', {
				method: 'POST',
				body: formData,
			});
			if (responseData.message === 'success') {
				router.reload('/profile');
			}
		} catch (error) {
			console.error(JSON.stringify(error));
		}
	}

	return (
		<Layout user={user}>
			<h1 className="text-5xl font-bold">
				Welcome back{' '}
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
					{user}
				</span>
				<span>👋</span>
			</h1>
			{avatar === 'myAvatar_ravrfl' && (
				<div>
					<h4>Select an image to upload</h4>
					<input type="file" onChange={uploadToClient} />
					<button
						className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
						type="submit"
						onClick={uploadToServer}
					>
						Set Profile Image
					</button>
				</div>
			)}
			{avatar && (
				<img
					src={`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_150,h_150,g_face,c_thumb,r_max/${avatar}`}
					alt="Profile"
				/>
			)}
		</Layout>
  	)
}

export async function getServerSideProps ({ req }) {
	const jwt = getTokenFromServerCookie(req);

	if (!jwt) {
		return {
			destination: '/'
		};
	} else {
		const responseData = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		})
		const avatar = responseData.avatar ? responseData.avatar : 'myAvatar_ravrfl';
		return {
			props: {
				avatar,
			}
		}
	}
}

export default ProfilePage