import { useForm } from 'react-hook-form'
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
} from '@chakra-ui/react'

function AddThresholds(){
    const { register, handleSubmit } = useForm();
    const onFormSubmit = (data) => console.log(data);
    const onErrors = (data) => console.log(data);

    return(
        <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
            <div>
                <label>Min Thresholds</label>
                <input name="Min Thresholds" {...register('Min Thresholds')} />
            </div>
            <div>
                <label>Max Thresholds</label>
                <input type="Max Thresholds" name="Min Thresholds" {...register('Min Thresholds')} />
            </div>
            <div>
                <label>Mail</label>
                <input type="email" name="mail" {...register('mail')} />
            </div>
            <button>Submit</button>
        </form>
    );
}

export default AddThresholds;