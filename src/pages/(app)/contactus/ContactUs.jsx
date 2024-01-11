import React from 'react'
import './ContactUs.css'
import rani from '@/assets/rani.jpg'
import worod from '@/assets/worod.jpg'
import phoneIcon from '@/assets/icons8-phone-50.png'

import emailIcon from '@/assets/icons8-email-30.png'

export const Component = () => {
	return (
		<div>
			<h2>Contact Us</h2>
			<div className="contact-us">
				<div className="contact-card">
					<img src={rani} alt="rani" />
					<h2>Rani Sultan</h2>
					<div className="contact-info">
						<div className="contact-item">
							<img src={phoneIcon} alt="Phone" />
							<span> 0502592176</span>
						</div>
						<div className="contact-item">
							<img src={emailIcon} alt="Email" />
							<span> ranisultan11@gmail.com</span>
						</div>
					</div>
				</div>
				<div className="contact-card">
					<img src={worod} alt="worod" />
					<h2>Worod Odetallah</h2>
					<div className="contact-info">
						<div className="contact-item">
							<img src={phoneIcon} alt="Phone" />
							<span>0525179040</span>
						</div>
						<div className="contact-item">
							<img src={emailIcon} alt="Email" />
							<span>worodaodetallah1@gmail.com</span>
						</div>
					</div>
				</div>
			</div>
			<p className="contact-text">
				If you need any help or have questions, feel free to contact us.
			</p>
		</div>
	)
}
