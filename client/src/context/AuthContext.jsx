import { createContext, useContext, useState, useEffect } from "react";
import { registerApi, loginApi, getProfileApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [token, setToken] = useState(() => localStorage.getItem("token") || null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Verify user profile on mount if token exists
	useEffect(() => {
		const verifyToken = async () => {
			if (token && !user) {
				try {
					const profileData = await getProfileApi();
					setUser(profileData);
					localStorage.setItem("user", JSON.stringify(profileData));
				} catch (err) {
					console.error("Token verification failed:", err);
					logout();
				}
			}
		};
		verifyToken();
	}, [token, user]);

	const register = async (userData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await registerApi(userData);
			setUser(data);
			setToken(data.token);
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data));
			return data;
		} catch (err) {
			const message =
				err.response?.data?.message ||
				err.message ||
				"Registration failed. Please check network connection.";
			setError(message);
			throw new Error(message);
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		setLoading(true);
		setError(null);
		try {
			const data = await loginApi(credentials);
			setUser(data);
			setToken(data.token);
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data));
			return data;
		} catch (err) {
			const message =
				err.response?.data?.message ||
				err.message ||
				"Login failed. Please check credentials or network connection.";
			setError(message);
			throw new Error(message);
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		setError(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	const clearError = () => setError(null);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				error,
				register,
				login,
				logout,
				clearError,
				isAuthenticated: !!token,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
