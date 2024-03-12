// TODO: use `ServiceResponse<T> with data: T[] | T` in the next release. 
export default class ServiceResponse {
	errorMessage?: string;
	statusCode?: number;
	data?: any;
}