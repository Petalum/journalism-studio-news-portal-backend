/** Current text statuses. */
const TextStatuses = {
    draft: 'draft',
    check: 'check',
    correct: 'correct',
    published: 'published',
};

/** Error messages returned by the server. */
const errorMessages = {
    badTextId: 'Идентификатор текста не указан',
    textAbcense: 'Текст отсутствует',
}

/** User roles list. */
const RolesList = {
    administrator: 'Administrator',
    editor: 'Editor',
    author: 'Author',
    guest: 'Guest',
}

module.exports = {
    TextStatuses,
    errorMessages,
    RolesList,
}