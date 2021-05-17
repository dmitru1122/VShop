import { CitiesVacancy, SalesforceGetResponse } from './controller';

class ParseSalesforse {
  public parseResponse(data: SalesforceGetResponse[]): CitiesVacancy[] {
    const uniqueCity = new Set();
    const resultArr: CitiesVacancy[] = [
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

  parseSalesforceRequest(data: CitiesVacancy): SalesforceGetResponse[] {
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

export default new ParseSalesforse();
