import {registerUser} from "@/app/users/actions";
import Field from "@/app/common/form/Field";

const RegisterForm = () => {
    return <div>
        <form action={registerUser}>
            <Field fieldName="email"/>
            <input type="submit" value="Register"/>
        </form>
    </div>
}

export default RegisterForm;
