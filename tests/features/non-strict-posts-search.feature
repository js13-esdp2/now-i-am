#language:ru
#noinspection NonAsciiCharacters

Функционал: Нестрогий поиск по занятиям
  Для того, чтобы пользоваться приложенем now-i-am
  Как обычный пользователь
  Я должен иметь возможность нестрогого поиска занятий

  @non-strict-posts-search
  Сценарий: Нестрогий поиск по занятиям
    Допустим  я нахожусь на странице "Логин"
    Если я ввожу в поля формы:
      | Почтовый адрес | anna@gmail.com |
      | Пароль         | 123            |
    И нажимаю на кнопку формы "Войти"
    То я должен увидеть текст "Вход успешно выполнен!"

    Допустим я нахожусь на странице "Поиск"
    И я ввожу в поля формы:
      | Название занятия | Пью кофе |
    И я жду "3" секунд
    И я кликаю на текст "Пью кофе" со стилями ".mat-option-text"
    И нажимаю на кнопку формы "Поиск"
    То я должен увидеть текст "Пью кофе"
    То я должен увидеть текст "Пью коллу"
    То я должен увидеть текст "Пью чай"
