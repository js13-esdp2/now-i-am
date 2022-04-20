const {I} = inject();
// Add in your custom step files

Given('я нахожусь на странице регистрации', () => {
    I.amOnPage('/register');
});

Given('я ввожу данные в поля формы', () => {
    I.fillField({name: 'displayName'}, 'Anna');
    I.fillField({name: 'email'}, 'anna@gmail.com');
    I.fillField({name: 'password'}, 'anna');
});

Given('нажимаю на кнопку на кнопку формы {string}', (buttonText) => {
    I.click(buttonText);
});

Given('вижу тект {string}', (text) => {
    I.wait(3);
    I.see(text);
});
