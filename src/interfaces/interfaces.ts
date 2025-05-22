export interface AuthRequest {
    email: string,
    password: string
}


export interface MessageResponse {
  message: string;
}

export interface ErrorResponse extends MessageResponse {
  stack?: string;
}

export interface DataResponse {
  data: any;
  errors: ErrorResponse[];
}