import Axios from '../../services/axios-instance';
import SFBody from '../../services/sf-body';
import S3Service, { S3Response } from '../../services/s3-storage/s3.service';

export interface SFFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  additional_information: string;
  position: string;
  city: string;
  school_name: string;
  speciality: string;
  graduation_year: string;
  english_level: string;
}

export interface SFFormResponse {
  status: string;
  message?: string;
  'x-folder': string;
  applicationId: string;
}

const WS_BACK_URL = process.env.WS_BACK_URL || '';

export class SFFormsService {
  private service = S3Service;
  private http = Axios;

  public async sendFormToSF(
    formData: SFFormData,
    secure: { method: string; gryzak: string; signature: string }
  ): Promise<SFFormResponse> {
    if (!WS_BACK_URL || !WS_BACK_URL.length) {
      throw new Error(`Backend URL isn't availble!`);
    }

    console.log('Form to SF: ');
    console.log(formData);
    console.log('======================');

    const { method, gryzak, signature } = secure;
    const {
      first_name,
      last_name,
      email,
      phone,
      additional_information,
      position,
      school_name,
      city,
      speciality,
      graduation_year,
      english_level,
    } = formData;
    const body = SFBody({
      method,
      firstName: first_name,
      lastName: last_name,
      additionalInformation: additional_information,
      graduationYear: graduation_year,
      englishLevel: english_level,
      schoolName: school_name,
      city,
      email,
      phone,
      position,
      speciality,
      gryzak,
      signature,
    });

    console.log('Body to SF request: ');
    console.log(body);
    console.log('======================');

    try {
      const sfdata = await this.sendForm(body);

      console.log('SALESFORCE RESPONSE: ');
      console.log(sfdata);

      const data: SFFormResponse = JSON.parse(sfdata);

      if (!data) throw { message: 'SF RESPONSE FOR NO RESUME ERROR!', reason: data };

      const { status } = data;

      if (status === 'Error') {
        throw { message: 'SF RESPONSE FOR NO RESUME STATUS ERROR!', reason: data };
      }

      return data;
    } catch (error) {
      throw { message: error.message || 'SF ERROR!', error: error.reason || error };
    }
  }

  public async sendResumeToSF(
    formData: { applicationId: string; folder: string; resumeTitle: string; resumeExternalKey: string; bucket: string },
    secure: { method: string; gryzak: string; signature: string }
  ): Promise<string> {
    if (!WS_BACK_URL || !WS_BACK_URL.length) {
      throw new Error(`Backend URL isn't availble!`);
    }

    console.log('Form to SF: ');
    console.log(formData);
    console.log('======================');

    const { method, gryzak, signature } = secure;
    const body = SFBody({
      method,
      applicationId: formData.applicationId,
      'x-folder': formData.folder,
      'x-bucket': formData.bucket,
      resumeTitle: formData.resumeTitle,
      resumeExternalKey: formData.resumeExternalKey,
      gryzak,
      signature,
    });

    console.log('Body to SF request: ');
    console.log(body);
    console.log('======================');

    try {
      const sfdata = await this.sendForm(body);

      console.log('SALESFORCE RESPONSE TO APPLY RESUME: ');
      console.log(sfdata);

      const { status } = JSON.parse(sfdata);

      if (status === 'Error') {
        throw { message: 'SALESFORCE RESPONSE TO APPLY RESUME STATUS ERROR!', reason: JSON.parse(sfdata) };
      }

      return sfdata;
    } catch (error) {
      throw { message: error.message || 'SF ERROR!', error: error.reason || error };
    }
  }

  public async sendS3file(file: string | ArrayBuffer, name: string, folder: string): Promise<S3Response> {
    return await this.service.uploadToBucket(file, name, folder);
  }

  private async sendForm(body: string): Promise<string> {
    const { data } = await this.http.post<string>(WS_BACK_URL, body);
    return data;
  }
}

export default new SFFormsService();
