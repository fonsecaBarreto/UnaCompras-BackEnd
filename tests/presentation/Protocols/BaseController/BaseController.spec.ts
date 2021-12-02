
/* MODELS */
import { MakeFakeBaseSchema } from '@/../tests/mocks/protocols/MakeBaseSchema';
import { IValidator } from '@/domain/Interfaces/vendors/IValidator';
import { AccountsRole } from '@/domain/Models/Entities/Accounts';
import { UserNotAllowedError } from '@/domain/Models/Errors';
import { BaseSchema } from '@/domain/Models/Schemas/BaseSchema';
import { User } from '@/domain/Models/Views/User';

/* SUT */
import BController, { BaseController, Request, Response, Ok, Unauthorized, Unprocessable, Forbidden, ServerError } from '@/presentation/Protocols/BaseController/BaseController'

/* MOCKS */
import { MakeFakeAccount, MakeFakeAddress  } from '@/tests/mocks/entities'
import { MakeFakeRequest } from '@/tests/mocks/protocols'

const makeSut = ( access?: BaseController.AccessType ) =>{

     class ValidatorStub implements BaseController.Validator {
          validate(schema: BaseSchema, params: IValidator.Params): Promise<IValidator.Errors> {
               return;
          }
     }

     class AuthorizatorStub  implements BaseController.Authorizator {
          isAdmin(user: User): Promise<boolean> {
               return Promise.resolve(true);
          }
          isVendor(user: User): Promise<boolean> {
               return Promise.resolve(true);
          }
          isCustomer(user: User): Promise<boolean> {
               return Promise.resolve(true);
          }
     }

     BController._validator = new ValidatorStub()
     BController._authorizator = new AuthorizatorStub();

     class ControllerStub extends BController {
          constructor(){ super(access) }
          async handler(request: Request): Promise<Response> {
               return Ok("Fine");
          }
     }

     const sut =  new ControllerStub()
     return { sut } 
}
/*   */
describe("Base Controller", () => {

     describe("_Handler", () =>{

          const MakeTestRequest = ( ) =>{
               const usuario = new User(MakeFakeAccount());
               const req = MakeFakeRequest({ user: usuario });
               return req
          }
          test("Shoudl call Authorization Guard with correct values", async ( ) => {
               const { sut } = makeSut()
               const authGuardSpy = jest.spyOn(sut, 'authorizationGuard');
               const req = MakeTestRequest();
               await sut._handler(req);
               expect(authGuardSpy).toHaveBeenCalledWith(req);
          })
          test("Shoudl return 403 if Authorization Guard returns false", async () => {
               const { sut } = makeSut()
               jest.spyOn(sut, 'authorizationGuard').mockImplementationOnce(async()=>false);
               const req = MakeTestRequest();
               const resp = await sut._handler(req);
               expect(resp).toEqual(Forbidden(new UserNotAllowedError()))
          })

          //VALIDATION GUARD
          test("Shoudl call validation Guard with correct values", async ( ) => {
               const { sut } = makeSut()
               const validationGuardSpy = jest.spyOn(sut, 'validationGuard');
               const req = MakeTestRequest();  
               await sut._handler(req);
               expect(validationGuardSpy).toHaveBeenCalledWith(req);
          })

          test("Shoudl return 422 if validation guard returns any value", async ( ) => {
               const { sut } = makeSut()
               jest.spyOn(sut, 'validationGuard').mockImplementationOnce(async ()=>{
                    return { name: "Qualquer valor" }
               });
               const req = MakeTestRequest();
               const response = await sut._handler(req);
               expect(response).toEqual(Unprocessable({ name: "Qualquer valor" }));
          })

          test("Shoudl call handler with correct values", async ( ) => {
               const { sut } = makeSut()
               const handleSpy = jest.spyOn(sut, 'handler');
               const req = MakeTestRequest();
               await sut._handler(req);
               expect(handleSpy).toHaveBeenCalledWith(req);
          })

          test("should return same response as handler", async ( ) => {
               const { sut } = makeSut()
               jest.spyOn(sut, 'handler').mockImplementationOnce(()=>{
                    return Promise.resolve(Forbidden("teste"));
               });
               const req = MakeTestRequest();
               const resp = await sut._handler(req);
               expect(resp).toEqual(Forbidden("teste"))
          })

          test("should return 500 with handler throws unknown error", async ( ) => {
               const { sut } = makeSut()
               jest.spyOn(sut, 'handler').mockImplementationOnce(()=>{
                    return Promise.reject( new Error('Um Erro Desconhecido'));
               });
               const req = MakeTestRequest();
               const resp = await sut._handler(req);
               expect(resp).toEqual(ServerError())
          })
     })

     describe("authorization Guard", () =>{
          
          test("Should return true if access is public", async () => {
               const { sut } = makeSut(BaseController.AccessType.PUBLIC);
               const req = MakeFakeRequest();
               const resp = await sut.authorizationGuard(req);
               expect(resp).toBe(true)
          });

          test("should return false if no user or role were found", async () =>{
               const { sut } = makeSut(BaseController.AccessType.USER);
               var req = MakeFakeRequest({user: null});
               var resp = await sut.authorizationGuard(req);
               expect(resp).toBe(false)
               req = MakeFakeRequest({user: new User(MakeFakeAccount({ role: null }))});
               resp = await sut.authorizationGuard(req);
               expect(resp).toBe(false)
          });

          describe("USER access", () =>{
               test("should return true if any user were provided", async () =>{
                    const { sut } = makeSut(BaseController.AccessType.USER);
                    var req = MakeFakeRequest({ user: new User(MakeFakeAccount()) });
                    var resp = await sut.authorizationGuard(req);
                    expect(resp).toBe(true)
               });
          })

          describe("Admin access", () =>{
               test("Should call Admin Authorizator once", async () =>{
                    const { sut } = makeSut(BaseController.AccessType.ADMIN);
                    const spyAdmin = jest.spyOn( BController._authorizator, 'isAdmin');
                    const spyCustomer = jest.spyOn( BController._authorizator, 'isCustomer');
                    const spyVendor = jest.spyOn( BController._authorizator, 'isVendor');
                    var req = MakeFakeRequest({ user: new User(MakeFakeAccount()) });
                    await sut.authorizationGuard(req);
                    expect(spyAdmin).toHaveBeenCalledTimes(1)
                    expect(spyCustomer).toHaveBeenCalledTimes(0)
                    expect(spyVendor).toHaveBeenCalledTimes(0)
               });
          })

          describe("Customer access", () =>{
               test("Should call Admin Authorizator once", async () =>{
                    const { sut } = makeSut(BaseController.AccessType.CUSTOMER);
                    const spyAdmin = jest.spyOn( BController._authorizator, 'isAdmin');
                    const spyCustomer = jest.spyOn( BController._authorizator, 'isCustomer');
                    const spyVendor = jest.spyOn( BController._authorizator, 'isVendor');
                    var req = MakeFakeRequest({ user: new User(MakeFakeAccount()) });
                    await sut.authorizationGuard(req);
                    expect(spyAdmin).toHaveBeenCalledTimes(0)
                    expect(spyCustomer).toHaveBeenCalledTimes(1)
                    expect(spyVendor).toHaveBeenCalledTimes(0)
               });
          })

          describe("Vendor access", () =>{
               test("Should call Admin Authorizator once", async () =>{
                    const { sut } = makeSut(BaseController.AccessType.VENDOR);
                    const spyAdmin = jest.spyOn( BController._authorizator, 'isAdmin');
                    const spyCustomer = jest.spyOn( BController._authorizator, 'isCustomer');
                    const spyVendor = jest.spyOn( BController._authorizator, 'isVendor');
                    var req = MakeFakeRequest({ user: new User(MakeFakeAccount()) });
                    await sut.authorizationGuard(req);
                    expect(spyAdmin).toHaveBeenCalledTimes(0)
                    expect(spyCustomer).toHaveBeenCalledTimes(0)
                    expect(spyVendor).toHaveBeenCalledTimes(1)
               });
          })
     })

     describe("Validation Guard", (  )=>{

          const makeSut = ( schemas?: BaseController.RequestsSchema) =>{

               class ValidatorStub implements BaseController.Validator {
                    validate(schema: BaseSchema, params: IValidator.Params): Promise<IValidator.Errors> {
                         return;
                    }
               }

               const validatorStub = new ValidatorStub()
               BController._validator = validatorStub;

               class controllerStub extends BController {
                    constructor(){super(BaseController.AccessType.PUBLIC, schemas )}
                    async handler(request: Request): Promise<Response> {
                         return Ok();
                    }
               }

               const sut =  new controllerStub()
               return { sut, validatorStub } 
          }

          test("Should return null if no schema were found", async () => {
               const { sut } = makeSut()
               const req = MakeFakeRequest();
               const resp = await sut.validationGuard(req);
               expect(resp).toBe(undefined);
          }) 

          test("Should call validator with correct values if params schema were provided", async () => {
               const paramsSchema = MakeFakeBaseSchema({ id: { type: "uuid" } })
               const { sut } = makeSut({ params: paramsSchema })
               const validatorSpy = jest.spyOn(BController._validator, 'validate')
               const req = MakeFakeRequest({params: {name: "Qualquer"}});
               await sut.validationGuard(req);
               expect(validatorSpy).toHaveBeenCalledWith(paramsSchema, { name: "Qualquer"} )
               expect(validatorSpy).toHaveBeenCalledTimes(1)
          }) 

          test("Should call validator with correct values if body schema were provided", async () => {
               const bodySchema = MakeFakeBaseSchema({ name: { type: "string" } })
               const { sut } = makeSut({ body: bodySchema })
               const validatorSpy = jest.spyOn(BController._validator, 'validate')
               const req = MakeFakeRequest({body: { name: "Lucas"}});
               await sut.validationGuard(req);
               expect(validatorSpy).toHaveBeenCalledWith(bodySchema, { name: "Lucas" } )
               expect(validatorSpy).toHaveBeenCalledTimes(1)
          }) 

          test("Should call validator with correct values if both schemas were provided", async () => {
               const bodySchema = MakeFakeBaseSchema({ name: { type: "string" } })
               const paramsSchema = MakeFakeBaseSchema({ id: { type: "uuid" } })

               const { sut } = makeSut({ body: bodySchema, params: paramsSchema });

               const validatorSpy = jest.spyOn(BController._validator, 'validate')
               const req = MakeFakeRequest({body: { name: "Lucas"}, params:{ id: "Um_id_qualquer" }});
               await sut.validationGuard(req);

               expect(validatorSpy).toHaveBeenNthCalledWith(1, paramsSchema, { id: "Um_id_qualquer" } )
               expect(validatorSpy).toHaveBeenNthCalledWith(2, bodySchema, { name: "Lucas" } )

          }) 

          //Body Schema
          test("Should have returned error if validator does", async () => {
               const bodySchema = MakeFakeBaseSchema({ name: { type: "string" } })
               const { sut, validatorStub } = makeSut({ body: bodySchema });

               jest.spyOn(validatorStub, 'validate').mockImplementationOnce(()=>{
                    return Promise.resolve({ name: "Nome contem um valor inadequeado"})
               })
             
               const req = MakeFakeRequest({body: { name:  123 } });
               const resp = await sut.validationGuard(req);

               expect(resp).toEqual({ name: "Nome contem um valor inadequeado" })
               
          }) 


          test("Should have returned none havent found any error", async () => {
               const bodySchema = MakeFakeBaseSchema({ name: { type: "string" } })
               const { sut, validatorStub } = makeSut({ body: bodySchema });

               jest.spyOn(validatorStub, 'validate').mockImplementationOnce(()=>{
                    return Promise.resolve(undefined)
               })
             
               const req = MakeFakeRequest({body: { name:  123 } });
               const resp = await sut.validationGuard(req);

               expect(resp).toEqual(undefined)
          }) 
          
     }) 

})
