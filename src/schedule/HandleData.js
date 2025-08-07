import Axios from "axios";

export const CreateScheduleEvent = async (data) => {
    try {
        const response = await Axios.post('http://localhost:5000/api/createScheduleEvent', data);
        // console.log(response.data);
        return response.data.success; // true or false
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const ReadScheduleEvent = async (churchID) => {
    try {
        const response = await Axios.post('http://localhost:5000/api/getScheduleEvent', { churchID: churchID });
        // console.log(response.data);
        return response.data; // return the data
    } catch (error) {
        console.log(error);
        return error;
    }
};
