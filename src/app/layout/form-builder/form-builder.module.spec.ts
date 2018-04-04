import { FormBuilderModule } from './form-builder.module';

describe('FormBuilderModule', () => {
    let FormBuilderModule: FormBuilderModule;

    beforeEach(() => {
        FormBuilderModule = new FormBuilderModule();
    });

    it('should create an instance', () => {
        expect(FormBuilderModule).toBeTruthy();
    });
});
