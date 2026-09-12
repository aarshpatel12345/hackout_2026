import api from "./axios";

export const saveOnboardingApi = async (data) => {
	try {
		const response = await api.post("/onboarding", data);
		localStorage.setItem("onboardingData", JSON.stringify(data));
		return response.data;
	} catch (err) {
		const is502OrNetwork = err.response?.status === 502 || err.code === "ERR_NETWORK" || !err.response;
		if (is502OrNetwork) {
			console.warn("Backend server offline (502/Network Error). Saving onboarding data to local storage.");
			localStorage.setItem("onboardingData", JSON.stringify(data));
			return {
				success: true,
				message: "Saved to local storage fallback",
				data,
			};
		}
		throw err;
	}
};

export const getOnboardingApi = async () => {
	try {
		const response = await api.get("/onboarding");
		if (response.data?.data) {
			localStorage.setItem("onboardingData", JSON.stringify(response.data.data));
		}
		return response.data;
	} catch (err) {
		const is502OrNetwork = err.response?.status === 502 || err.code === "ERR_NETWORK" || !err.response;
		if (is502OrNetwork) {
			console.warn("Backend server offline (502/Network Error). Loading onboarding data from local storage.");
			const saved = localStorage.getItem("onboardingData");
			return {
				success: true,
				data: saved ? JSON.parse(saved) : null,
			};
		}
		throw err;
	}
};
