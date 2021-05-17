"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParseSalesforse {
    parseResponse(data) {
        const uniqueCity = new Set();
        const resultArr = [
            {
                city_title: '',
                active: false,
                vacancies: [
                    {
                        link_name: '',
                        title: '',
                    },
                ],
            },
        ];
        data.map(item => {
            uniqueCity.add(item.Name);
        });
        let i = 0;
        for (const key of uniqueCity) {
            resultArr[i] = {
                city_title: '',
                active: false,
                vacancies: [],
            };
            data.map(item => {
                if (key === item.Name) {
                    resultArr[i] = {
                        city_title: key,
                        active: false,
                        vacancies: [...resultArr[i].vacancies, { link_name: '', title: item.VacancyTitle__c }],
                    };
                }
            });
            i++;
        }
        return resultArr;
    }
    parseSalesforceRequest(data) {
        const arr = [{ Name: '', VacancyTitle__c: '' }];
        data.vacancies.map(vacancy => {
            data.city_title;
            vacancy.title;
            arr.push({ Name: data.city_title, VacancyTitle__c: vacancy.title });
        });
        arr.shift();
        return arr;
    }
}
exports.default = new ParseSalesforse();
