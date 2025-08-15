import React from 'react'

export const countGroupsByAgeAndGender = (people) => {
    const result = {
        Male: 0,
        Female: 0,
        Youth: { Male: 0, Female: 0 },
        Adult: { Male: 0, Female: 0 },
        Senior: { Male: 0, Female: 0 },
        Invalid: 0
    };

    const today = new Date();
    people.forEach((value) => {

        if (value.gender === 'Male') {
            result.Male += 1;
        } else if (value.gender === 'Female') {
            result.Female += 1;
        }

        if (value.dateOfBirth) {
            const birthDate = new Date(value.dateOfBirth);
            const age = today.getFullYear() - birthDate.getFullYear();

            if (age < 18) {
                result.Youth[value.gender === 'Male' ? 'Male' : 'Female'] += 1;
            } else if (age >= 18 && age < 60) {
                result.Adult[value.gender === 'Male' ? 'Male' : 'Female'] += 1;
            } else if (age >= 60) {
                result.Senior[value.gender === 'Male' ? 'Male' : 'Female'] += 1;
            } else {
                result.Invalid += 1;
            }
        }
    });

    return result;
}

