
import imageService from "./imageService";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useSelector } from 'react-redux';

const animalService = () => {

    const { uploadAnimalPicture } = imageService();
    let currentUserId = useSelector((state) => state.currentUser.currentUserId);


    const createPet = async (formData, petPic) => {
        const response = await fetch(`${apiUrl}/api/animals/`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                datePosted: new Date().toJSON(),
                name: formData.name,
                species: formData.species,
                breed: formData.breed,
                sex: formData.sex,
                age: formData.age,
                ageClass: formData.ageClass,
                size: formData.size,
                height: formData.height,
                weight: formData.weight,
                description: formData.description,
                centerId: currentUserId,
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (petPic != null) {
                const picResult = await uploadAnimalPicture(petPic, result.id);
                if (!picResult) {
                    return null;
                }
            }
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

    const getCenterAnimals = async (centerId) => {
        const response = await fetch(`${apiUrl}/api/animals/center/${centerId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Getting pets failed ${result.message}`);
            return null;
        }
    }

    const getCenterAdoptedAnimals = async (centerId) => {
        const response = await fetch(`${apiUrl}/api/animals/center/${centerId}/adopted`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Getting adopted pets failed ${result.message}`);
            return null;
        }
    }

    const getAnimal = async (animalId) => {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Get animal failed: ${result.message}`);
            return null;
        }
    };

    const updateAdoptionStatus = async (animalId, status) => {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}/updateAdoptionStatus?status=${status}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Updating adoption status failed: ${result.message}`);
            return null;
        }
    };

    const deleteAnimal = async (animalId) => {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Delete Animal failed: ${result.message}`);
            return null;
        }
    };

    const getRecommendedAnimals = async (userId, requestFilter, previousIds = []) => {
        requestFilter.alreadyDisplayedIds = previousIds;
        const response = await fetch(`${apiUrl}/api/animals/recommend?userId=${userId}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestFilter)
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting recommended animals failed ${result.message}`);
            return null;
        }
    }
    const getUniqueAnimalTypes = async () => {
        const response = await fetch(`${apiUrl}/api/animals/uniqueTypes`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting unique animal info failed ${result.message}`);
            return null;
        }
    }

    const getLikedAnimals = async (userId, pageSize, alreadyDisplayedIds) => {

        const response = await fetch(`${apiUrl}/api/animals/liked?pageSize=${pageSize}&userId=${userId}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alreadyDisplayedIds)
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting pets failed ${result.message}`);
            return null;
        }
    }

    const updateAnimal = async (formData, animalPic, petId) => {
        const response = await fetch(`${apiUrl}/api/animals/${petId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: formData.name,
                age: formData.age,
                species: formData.species,
                breed: formData.breed,
                sex: formData.sex,
                description: formData.description,
                size: formData.size,
                ageClass: formData.ageClass,
                height: formData.height,
                weight: formData.weight,
            })
        });

        const result = await response.json();
        if (response.ok) {
            //try to upload banner and profile pic if they exist
            if (animalPic != null) {
                const picResult = await uploadAnimalPicture(animalPic, petId);
                if (!picResult) {
                    return null;
                }
            }
            //return wheter or not both were successful
            return result;
        } else {
            alert(`Update failed: ${result.message}`);
            return null;
        }
    };

    return {
        createPet,
        getAnimal,
        getCenterAnimals,
        getCenterAdoptedAnimals,
        getAnimal,
        updateAdoptionStatus,
        deleteAnimal,
        getRecommendedAnimals,
        getUniqueAnimalTypes,
        getLikedAnimals,
        updateAnimal,
    };

};
export default animalService;
