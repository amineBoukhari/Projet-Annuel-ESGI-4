import { decodeTokenPayload } from "./decodeToken";

export const auth = {
    fetchUser: async (token) => {
        try {
            const { id } = decodeTokenPayload(token);
            const response = await fetch(
              `http://localhost:3000/api/users/get/${id}`,
              {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            if (!response.ok) {
                console.error('Failed fetch:' + response.status)
            }
    
            return await response.json();
        } catch (error) {
            console.log(error)
        }
        
  },
};
