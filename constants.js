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

module.exports = {
    TextStatuses,
    errorMessages,
}