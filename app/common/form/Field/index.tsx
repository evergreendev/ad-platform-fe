const Field = (
    {fieldName, labelOverride, defaultValue}
    : { fieldName: string, labelOverride?: string, defaultValue?: string }) => {
    const defaultLabel = fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    const label = labelOverride ?? defaultLabel;

    return <div className="m-4">
        <label className="mr-2" htmlFor={fieldName}>{label}:</label>
        <input className="bg-white border border-green-100 p-2 rounded" type="text" name={fieldName} defaultValue={defaultValue}/>
    </div>
}

export default Field;
