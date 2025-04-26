import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	UnauthorizedException,
	HttpStatus,
} from "@nestjs/common";

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
	catch(exception: UnauthorizedException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		console.log(exception.message);

		if (exception.message === "jwt expired") {
			response.status(HttpStatus.FORBIDDEN).json({
				statusCode: HttpStatus.FORBIDDEN,
				timestamp: new Date().toISOString(),
				path: request.url,
				message: "Token has expired",
			});
		} else {
			response.status(exception.getStatus()).json(exception.getResponse());
		}
	}
}
