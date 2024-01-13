import { Icon } from '@iconify/react'
import { Languages } from '@/firebase/config'
import { useCollection2 } from '@/hooks/useCollection2'
import { useCallback, useState } from 'react'
import IconButton from '@/components/base/IconButton'

export const Component = () => {
	const { data: languages, setData: setLanguages } = useCollection2('languages')

	const onDeleteLanguage = useCallback(async (language) => {
		if (confirm(`Are you sure delete this language?`)) {
			await Languages.doc(language.uid).delete()
			setLanguages((languages) => {
				return languages.filter((item) => {
					return item.uid !== language.uid
				})
			})
		}
	}, [])

	const [isForm, setIsForm] = useState(false)
	const [form, setForm] = useState({
		name: '',
		icon: '',
	})

	const onChangeForm = useCallback(
		(name) => (e) => {
			setForm((v) => ({
				...v,
				[name]: e.target.value,
			}))
		},
		[]
	)

	const onResetForm = useCallback(() => {
		setIsForm(false)
		setForm({ name: '', icon: '' })
	}, [])

	const onSubmitForm = useCallback(
		async (e) => {
			e.preventDefault()
			await Languages.add({
				name: form.name,
				icon: form.icon,
				value: form.name.toLowerCase().split(' ').join('_'),
				updatedAt: Date.now(),
				createdAt: Date.now(),
			})
			onResetForm()
		},
		[form]
	)

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-bold">Languages</h1>
				{!isForm && (
					<button className="btn" onClick={() => setIsForm(true)}>
						Add Language
					</button>
				)}
			</div>
			<div className="mt-8">
				{isForm ? (
					<form className="max-w-sm" onSubmit={onSubmitForm}>
						<label>
							<span>Name : </span>
							<input
								required
								type="text"
								value={form.name}
								onChange={onChangeForm('name')}
							/>
						</label>
						<div>
							<label>
								<span className="flex items-center justify-between">
									<span className="!mb-0">Icon : </span>
								</span>
								<div className="relative">
									<input
										required
										type="text"
										value={form.icon}
										onChange={onChangeForm('icon')}
									/>
									{form.icon && (
										<div className="absolute right-0.5 h-10 w-10 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
											<Icon icon={form.icon} className="text-2xl" />
										</div>
									)}
								</div>
							</label>
						</div>
						<div className="flex space-x-4">
							<button type="submit" className="btn bg-[var(--primary-color)] text-white">
								Save
							</button>
							<button className="btn" onClick={onResetForm}>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<div className="grid grid-cols-4 gap-8">
						{languages.map((language, index) => (
							<div
								key={index}
								className="p-4 border border-neutral-200 rounded-lg shadow-lg group"
							>
								<Icon icon={language.icon} className="text-5xl" />
								<div className="flex items-center justify-between">
									<div>{language.name}</div>

									<IconButton
										icon="bx:trash"
										className="transition-transform duration-300 transform scale-0 group-hover:scale-100"
										onClick={() => onDeleteLanguage(language)}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
